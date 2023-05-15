import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { RentalService } from "./rental.service";
import { FindAllRentalDto } from "./dto/findAllRental.dto";
import { CreateRentalDto } from "./dto/createRental.dto";

@Controller("rentals")
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get()
  async findAll(@Query() query: FindAllRentalDto) {
    return this.rentalService.findAll(query);
  }

  @Post()
  async create(@Body() body: CreateRentalDto) {
    return this.rentalService.create(body);
  }
}
