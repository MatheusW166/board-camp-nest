import * as Joi from "joi";

export const updateCustomerSchema = Joi.object({
  name: Joi.string().trim().min(1).optional(),
  phone: Joi.string().trim().min(10).max(11).optional(),
  cpf: Joi.string().trim().replace(/\D/, "").length(11).optional(),
  birthday: Joi.string().trim().isoDate().optional(),
}).min(1);

export interface UpdateCustomerDto {
  name?: string;
  phone?: string;
  cpf?: string;
  birthday?: string;
}
