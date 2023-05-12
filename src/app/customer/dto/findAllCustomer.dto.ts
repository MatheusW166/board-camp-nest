export interface FindAllCustomerDto {
  offset?: number;
  limit?: number;
  cpf?: string;
  desc?: boolean;
  order?: string;
}
