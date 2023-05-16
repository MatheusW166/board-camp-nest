import { BadRequestException, Injectable } from "@nestjs/common";
import {
  DeleteResult,
  IsNull,
  MoreThanOrEqual,
  Not,
  Repository,
} from "typeorm";
import { RentalEntity, mapRentalColumn } from "./rental.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindAllRentalDto } from "./dto/findAllRental.dto";
import { diffInDays, isIsoDate } from "../../helpers/date.helpers";
import { CreateRentalDto } from "./dto/createRental.dto";
import { GameService } from "../game/game.service";
import { CustomerService } from "../customer/customer.service";
import { DbErrorsExplain } from "../../constants/db.constants";

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(RentalEntity)
    private readonly rentalRepository: Repository<RentalEntity>,
    private readonly gameService: GameService,
    private readonly customerService: CustomerService,
  ) {}

  async findAll({
    customerId,
    desc,
    gameId,
    limit,
    offset,
    order,
    startDate,
    status,
  }: FindAllRentalDto): Promise<RentalEntity[]> {
    const orderBy = mapRentalColumn(order) ?? "id";
    return this.rentalRepository.find({
      order: { [orderBy]: desc ? "DESC" : "ASC" },
      where: {
        customer: { id: customerId },
        game: { id: gameId },
        rentDate: isIsoDate(startDate) ? MoreThanOrEqual(startDate) : null,
        returnDate: status && (status === "open" ? IsNull() : Not(IsNull())),
      },
      relations: {
        customer: true,
        game: true,
      },
      select: {
        customer: { id: true, name: true },
        game: { id: true, name: true },
      },
      skip: offset,
      take: limit,
    });
  }

  async findById(id: number): Promise<RentalEntity> {
    return this.rentalRepository.findOne({
      where: { id },
      relations: { customer: true, game: true },
    });
  }

  async returnRental(id: number): Promise<RentalEntity> {
    const rental = await this.findById(id);
    if (!rental) {
      throw new BadRequestException(DbErrorsExplain.rentalNotFound);
    }
    if (rental.returnDate) {
      throw new BadRequestException(DbErrorsExplain.rentalFinished);
    }

    const rentDate = new Date(rental.rentDate).getTime();
    const delayInDays = diffInDays(rentDate, Date.now()) - rental.daysRented;

    const delayFee =
      (delayInDays < 0 ? 0 : delayInDays) * rental.game.pricePerDay;

    rental.returnDate = new Date().toISOString();
    rental.delayFee = delayFee;

    return this.rentalRepository.save(rental);
  }

  async deleteRental(id: number): Promise<DeleteResult> {
    const rental = await this.findById(id);
    if (!rental) {
      throw new BadRequestException(DbErrorsExplain.rentalNotFound);
    }
    if (!rental.returnDate) {
      throw new BadRequestException(DbErrorsExplain.rentalNotFinished);
    }
    return this.rentalRepository.delete(rental);
  }

  async create(data: CreateRentalDto): Promise<RentalEntity> {
    const { gameId, customerId } = data;
    const rentalsCount = await this.countGamesRented(gameId);
    const gameInStock = await this.gameService.findById(gameId);

    if (rentalsCount >= gameInStock.stockTotal) {
      throw new BadRequestException(DbErrorsExplain.gameOutOfStock);
    }

    const customer = await this.customerService.findById(customerId);

    const newRentalEntity = this.rentalRepository.create({
      ...data,
      originalPrice: gameInStock.pricePerDay,
      customer: customer,
      game: gameInStock,
    });

    return this.rentalRepository.save(newRentalEntity);
  }

  private async countGamesRented(gameId: number): Promise<number> {
    return this.rentalRepository.count({
      where: { returnDate: IsNull(), game: { id: gameId } },
    });
  }
}
