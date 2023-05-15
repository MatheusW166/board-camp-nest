import * as Joi from "joi";

export const createRentalSchema = Joi.object({
  customerId: Joi.number().positive().required(),
  gameId: Joi.number().positive().required(),
  daysRented: Joi.number().min(1).required(),
});

export interface CreateRentalDto {
  customerId: number;
  gameId: number;
  daysRented: number;
}
