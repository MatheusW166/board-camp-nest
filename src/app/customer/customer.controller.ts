import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from "@nestjs/common";
import { CustomerService } from "./customer.service";
import {
  CreateCustomerDto,
  createCustomerSchema,
} from "./dto/createCustomer.dto";
import { ValidationPipe } from "../../pipes/validation/validation.pipe";
import { updateCustomerSchema } from "./dto/updateCustomer.dto";
import { FindAllCustomerDto } from "./dto/findAllCustomer.dto";

@Controller("customers")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async findAll(@Query() query: FindAllCustomerDto) {
    return this.customerService.findAll(query);
  }

  @Get(":id")
  async findById(@Param("id") id: number) {
    return this.customerService.findById(id);
  }

  @Patch(":id")
  @UsePipes(new ValidationPipe(updateCustomerSchema))
  async update(
    @Param("id") id: number,
    @Body() body: Partial<CreateCustomerDto>,
  ) {
    return this.customerService.update(id, body);
  }

  @Post()
  @UsePipes(new ValidationPipe(createCustomerSchema))
  async create(@Body() body: CreateCustomerDto) {
    return this.customerService.create(body);
  }
}
