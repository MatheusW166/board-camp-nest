import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CustomerEntity } from "../customer/customer.entity";
import { GameEntity } from "../game/game.entity";

@Index("rentals_primary_key", ["id"], { unique: true })
@Entity({ name: "rentals", schema: "public" })
export class RentalEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @CreateDateColumn({ type: "date", name: "rentDate" })
  rentDate: string;

  @Column("integer", { name: "daysRented" })
  daysRented: number;

  @Column("date", { name: "returnDate", nullable: true, default: null })
  returnDate: string | null;

  @Column("integer", { name: "originalPrice" })
  originalPrice: number;

  @Column("integer", { name: "delayFee", nullable: true, default: null })
  delayFee: number | null;

  @ManyToOne(() => GameEntity, (game) => game.rentals, { onDelete: "CASCADE" })
  game: GameEntity;

  @ManyToOne(() => CustomerEntity, (customer) => customer.rentals, {
    onDelete: "CASCADE",
  })
  customer: CustomerEntity;
}

export function isRentalColumn(columnName: string): boolean {
  return [
    "rentDate",
    "daysRented",
    "returnDate",
    "originalPrice",
    "delayFee",
    "customerId",
    "gameId",
  ].includes(columnName);
}

export function mapRentalColumn(columnName: string): string | null {
  if (!isRentalColumn(columnName)) return null;
  const columnMap = {
    gameId: "game.id",
    customerId: "customer.id",
  };
  return columnMap[columnName] ?? columnName;
}
