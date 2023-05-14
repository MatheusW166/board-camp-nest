import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ILike, Repository } from "typeorm";
import { GameEntity, isGameColumn } from "./game.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindAllGameDto } from "./dto/findAllGame.dto";
import { CreateGameDto } from "./dto/createGame.dto";
import { DbErrors, DbErrorsExplain } from "../../constants/db.constants";

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
  ) {}

  async create(data: CreateGameDto): Promise<GameEntity> {
    try {
      return await this.gameRepository.save(this.gameRepository.create(data));
    } catch (err) {
      if (err.message?.includes(DbErrors.duplicatedKey)) {
        throw new ConflictException(DbErrorsExplain.gameInsertionConflict);
      }
      throw new BadRequestException();
    }
  }

  async findAll({
    name,
    offset,
    limit,
    order,
    desc = false,
  }: FindAllGameDto): Promise<GameEntity[]> {
    const orderBy = isGameColumn(order) ? order : "id";
    return this.gameRepository.find({
      order: { [orderBy]: desc ? "DESC" : "ASC" },
      where: name && { name: ILike(`%${name}%`) },
      skip: offset,
      take: limit,
    });
  }

  async findById(id: number): Promise<GameEntity> {
    const game = await this.gameRepository.findOneBy({ id });
    if (!game) {
      throw new NotFoundException();
    }
    return game;
  }
}
