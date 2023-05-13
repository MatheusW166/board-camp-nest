import { Test, TestingModule } from "@nestjs/testing";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";
import { CustomerEntity } from "./customer.entity";
import { CreateCustomerDto } from "./dto/createCustomer.dto";

const customerEntityList: CustomerEntity[] = [
  {
    id: 1,
    cpf: "12345678912",
    birthday: "1999-07-08",
    name: "John Doe",
    phone: "+13156661234",
  },
  {
    id: 2,
    cpf: "33345678912",
    birthday: "2000-04-02",
    name: "Double John",
    phone: "+15851664321",
  },
];

describe("CustomerController", () => {
  let customerController: CustomerController;
  let customerService: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(customerEntityList),
            findById: jest.fn().mockResolvedValue(customerEntityList[0]),
            create: jest.fn().mockResolvedValue(customerEntityList[0]),
            update: jest.fn().mockResolvedValue("OK"),
          },
        },
      ],
    }).compile();

    customerController = module.get<CustomerController>(CustomerController);
    customerService = module.get<CustomerService>(CustomerService);
  });

  it("should be defined", () => {
    expect(customerController).toBeDefined();
    expect(customerService).toBeDefined();
  });

  describe("findAll", () => {
    it("should return a customer entity list successfully", async () => {
      const result = await customerController.findAll({ limit: 10 });
      expect(result).toEqual(customerEntityList);
      expect(customerService.findAll).toHaveBeenCalledTimes(1);
    });

    it("should thrown an exception", () => {
      jest.spyOn(customerService, "findAll").mockRejectedValueOnce(new Error());
      expect(customerController.findAll({})).rejects.toThrowError();
    });
  });

  describe("findById", () => {
    it("should return a customer entity successfully", async () => {
      const result = await customerController.findById(1);
      expect(result).toEqual(customerEntityList[0]);
      expect(customerService.findById).toHaveBeenCalledTimes(1);
    });

    it("should trhown an exception", async () => {
      jest
        .spyOn(customerService, "findById")
        .mockRejectedValueOnce(new Error());
      expect(customerController.findById).rejects.toThrowError();
    });
  });

  describe("create", () => {
    const body: CreateCustomerDto = {
      cpf: "12345678912",
      birthday: "1999-07-08",
      name: "John Doe",
      phone: "+13156661234",
    };

    it("should create a new customer successfully", async () => {
      const result = await customerController.create(body);
      expect(result).toEqual(customerEntityList[0]);
      expect(customerService.create).toHaveBeenCalledWith(body);
    });

    it("it should thrown an error", () => {
      jest.spyOn(customerService, "create").mockRejectedValueOnce(new Error());
      expect(customerController.create(body)).rejects.toThrow(new Error());
    });
  });

  describe("update", () => {
    const body: Partial<CreateCustomerDto> = {
      phone: "+13156661234",
    };

    it("should update a customer successfully", async () => {
      const result = await customerController.update(1, body);
      expect(result).toEqual("OK");
      expect(customerService.update).toHaveBeenCalledWith(1, body);
    });

    it("it should thrown an error", () => {
      jest.spyOn(customerService, "update").mockRejectedValueOnce(new Error());
      expect(customerController.update(1, body)).rejects.toThrow(new Error());
    });
  });
});
