import * as Joi from "joi";

export const createCustomerSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  phone: Joi.string().trim().min(10).max(11).required(),
  cpf: Joi.string().trim().replace(/\D/, "").length(11).required(),
  birthday: Joi.string().trim().isoDate().required(),
});

export interface CreateCustomerDto {
  name: string;
  phone: string;
  cpf: string;
  birthday: string;
}
