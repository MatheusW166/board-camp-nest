/* eslint-disable @typescript-eslint/quotes */
import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ObjectSchema, ValidationError, ValidationErrorItem } from "joi";

function mapErrorDetails(detail: ValidationErrorItem) {
  const key =
    detail.context.key ??
    detail.context.label ??
    detail.context.value ??
    "message";
  return {
    [key]: detail.message,
  };
}

function isErrorRelevant(error: ValidationError) {
  return error.details[0].message !== '"value" must be of type object';
}

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}
  transform(input: any) {
    const { error, value } = this.schema.validate(input, { abortEarly: false });
    if (error && isErrorRelevant(error)) {
      throw new BadRequestException({
        error: [error.details.map(mapErrorDetails)],
      });
    }
    return value;
  }
}
