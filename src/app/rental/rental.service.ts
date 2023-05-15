import { BadRequestException, Injectable } from "@nestjs/common";
import { IsNull, MoreThanOrEqual, Not, Repository } from "typeorm";
import { RentalEntity, mapRentalColumn } from "./rental.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindAllRentalDto } from "./dto/findAllRental.dto";
import { isIsoDate } from "../../helpers/date.helpers";
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
  }: FindAllRentalDto) {
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

  async create(data: CreateRentalDto) {
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

  private async countGamesRented(gameId: number) {
    return this.rentalRepository.count({
      where: { returnDate: IsNull(), game: { id: gameId } },
    });
  }
}
