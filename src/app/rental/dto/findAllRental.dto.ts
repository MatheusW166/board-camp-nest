export interface FindAllRentalDto {
  customerId?: number;
  gameId?: number;
  offset?: number;
  limit?: number;
  order?: string;
  desc?: boolean;
  startDate?: string;
  status?: "open" | "closed";
}
