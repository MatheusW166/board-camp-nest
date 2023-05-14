import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { CustomerEntity, isCustomerColumn } from "./customer.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCustomerDto } from "./dto/createCustomer.dto";
import { FindAllCustomerDto } from "./dto/findAllCustomer.dto";
import { DbErrors, DbErrorsExplain } from "../../constants/db.constants";

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async create(data: CreateCustomerDto): Promise<CustomerEntity> {
    try {
      return await this.customerRepository.save(
        this.customerRepository.create(data),
      );
    } catch (err) {
      if (err.message?.includes(DbErrors.duplicatedKey)) {
        throw new ConflictException(DbErrorsExplain.customerInsertionConflict);
      }
      throw new BadRequestException();
    }
  }

  async findAll({
    cpf,
    offset,
    limit,
    order,
    desc = false,
  }: FindAllCustomerDto): Promise<CustomerEntity[]> {
    const orderBy = isCustomerColumn(order) ? order : "id";
    return this.customerRepository.find({
      order: { [orderBy]: desc ? "DESC" : "ASC" },
      where: cpf && { cpf },
      skip: offset,
      take: limit,
    });
  }

  async findById(id: number): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException();
    }
    return customer;
  }

  async update(id: number, data: Partial<CreateCustomerDto>) {
    try {
      await this.customerRepository.update(
        {
          id,
        },
        this.customerRepository.create(data),
      );
    } catch (err) {
      if (err.message?.includes(DbErrors.duplicatedKey)) {
        throw new ConflictException(DbErrorsExplain.customerInsertionConflict);
      }
      throw new BadRequestException();
    }
  }
}
