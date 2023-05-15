import { Body, Controller, Get, Post, Query, UsePipes } from "@nestjs/common";
import { RentalService } from "./rental.service";
import { FindAllRentalDto } from "./dto/findAllRental.dto";
import { CreateRentalDto, createRentalSchema } from "./dto/createRental.dto";
import { ValidationPipe } from "../../pipes/validation.pipe";
import { RentalEntity } from "./rental.entity";

@Controller("rentals")
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get()
  async findAll(@Query() query: FindAllRentalDto): Promise<RentalEntity[]> {
    return this.rentalService.findAll(query);
  }

  @Post()
  @UsePipes(new ValidationPipe(createRentalSchema))
  async create(@Body() body: CreateRentalDto): Promise<RentalEntity> {
    return this.rentalService.create(body);
  }
}
