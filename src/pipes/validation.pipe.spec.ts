import { BadRequestException } from "@nestjs/common";
import {
  CreateCustomerDto,
  createCustomerSchema,
} from "../app/customer/dto/createCustomer.dto";
import { ValidationPipe } from "./validation.pipe";

describe("ValidationPipe", () => {
  const createCustomerValidation = new ValidationPipe(createCustomerSchema);

  describe("createCustomerSchema", () => {
    it("should accept a valid customer", () => {
      const validCustomer: CreateCustomerDto = {
        name: "John Doe",
        birthday: "2000-07-06",
        cpf: "12335197810",
        phone: "6492929292",
      };
      const result = createCustomerValidation.transform(validCustomer);
      expect(result).toBeDefined();
    });

    it("should transform a valid customer", () => {
      const validCustomer: CreateCustomerDto = {
        name: " John Doe ",
        birthday: " 2000-07-06 ",
        cpf: " 1b2335197810 ",
        phone: " 6492929292 ",
      };
      const transformed: CreateCustomerDto = {
        name: "John Doe",
        birthday: "2000-07-06T00:00:00.000Z",
        cpf: "12335197810",
        phone: "6492929292",
      };
      const result = createCustomerValidation.transform(validCustomer);
      expect(result).toEqual(transformed);
    });

    it("should trhown a bad request exception when birthday is not an iso date", () => {
      const invalidCustomer: CreateCustomerDto = {
        birthday: "not a iso",
        cpf: "12345678910",
        name: "John Doe",
        phone: "12312312312",
      };

      expect(() =>
        createCustomerValidation.transform(invalidCustomer),
      ).toThrowError(BadRequestException);
    });

    it("should trhown a bad request exception when name is empty", () => {
      const invalidCustomer: CreateCustomerDto = {
        birthday: "1999-07-08",
        cpf: "12345678910",
        name: "",
        phone: "12312312312",
      };

      expect(() =>
        createCustomerValidation.transform(invalidCustomer),
      ).toThrowError(BadRequestException);
    });

    it("should trhown a bad request exception when cpf is not equal to 11 characters", () => {
      const invalidCustomer: CreateCustomerDto = {
        birthday: "1999-07-08",
        cpf: "1234567891",
        name: "John Doe",
        phone: "12312312312",
      };

      expect(() =>
        createCustomerValidation.transform(invalidCustomer),
      ).toThrowError(BadRequestException);
    });

    it("should trhown a bad request exception when phone is less than 10 characters", () => {
      const invalidCustomer: CreateCustomerDto = {
        birthday: "1999-07-08",
        cpf: "12345678944",
        name: "John Doe",
        phone: "123123123",
      };

      expect(() =>
        createCustomerValidation.transform(invalidCustomer),
      ).toThrowError(BadRequestException);
    });

    it("should trhown a bad request exception when phone is bigger than 11 characters", () => {
      const invalidCustomer: CreateCustomerDto = {
        birthday: "1999-07-08",
        cpf: "12312312345",
        name: "John Doe",
        phone: "123123123123",
      };

      expect(() =>
        createCustomerValidation.transform(invalidCustomer),
      ).toThrowError(BadRequestException);
    });
  });
});
