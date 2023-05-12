import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UsePipes,
} from "@nestjs/common";
import { CustomerService } from "./customer.service";
import {
  CreateCustomerDto,
  createCustomerSchema,
} from "./dto/createCustomer.dto";
import { ValidationPipe } from "../pipes/validation.pipe";
import {
  UpdateCustomerDto,
  updateCustomerSchema,
} from "./dto/updateCustomer.dto";
import { Request } from "express";

@Controller("customers")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async findAll(@Req() req: Request) {
    return this.customerService.findAll(req.query);
  }

  @Get(":id")
  async findById(@Param("id") id: number) {
    return this.customerService.findById(id);
  }

  @UsePipes(new ValidationPipe(updateCustomerSchema))
  @Patch(":id")
  async update(@Param("id") id: number, @Body() body: UpdateCustomerDto) {
    return this.customerService.update(id, body);
  }

  @UsePipes(new ValidationPipe(createCustomerSchema))
  @Post()
  async create(@Body() body: CreateCustomerDto) {
    return this.customerService.create(body);
  }
}
