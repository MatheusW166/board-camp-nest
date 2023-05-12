import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { CustomerEntity, isCustomerColumn } from "./customer.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCustomerDto } from "./dto/createCustomer.dto";
import { FindAllCustomerDto } from "./dto/findAllCustomer.dto";

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async create(data: CreateCustomerDto): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findOne({
      where: { cpf: data.cpf },
    });
    if (customer) {
      throw new ConflictException("This user already exists");
    }
    return this.customerRepository.save(this.customerRepository.create(data));
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
    const { cpf } = data;
    let customerFound: CustomerEntity;

    if (cpf) {
      customerFound = await this.customerRepository.findOneBy({
        cpf,
      });
    }

    if (customerFound && customerFound.id !== Number(id)) {
      throw new ConflictException("There is another customer with this cpf");
    }

    const { affected } = await this.customerRepository.update(
      {
        id,
      },
      this.customerRepository.create(data),
    );

    if (affected === 0) {
      throw new NotFoundException();
    }

    return "OK";
  }
}
