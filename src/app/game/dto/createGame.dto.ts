import * as Joi from "joi";

export const createGameSchema = Joi.object({
  name: Joi.string().trim().required(),
  image: Joi.string().uri().required(),
  stockTotal: Joi.number().integer().min(1),
  pricePerDay: Joi.number().integer().min(1),
});

export interface CreateGameDto {
  name: string;
  image: string;
  stockTotal: number;
  pricePerDay: number;
}
