import {
  Column,
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

  @Column("date", { name: "rentDate" })
  rentDate: string;

  @Column("integer", { name: "daysRented" })
  daysRented: number;

  @Column("date", { name: "returnDate", nullable: true })
  returnDate: string | null;

  @Column("integer", { name: "originalPrice" })
  originalPrice: number;

  @Column("integer", { name: "delayFee", nullable: true })
  delayFee: number | null;

  @ManyToOne(() => GameEntity, (game) => game.rentals, { onDelete: "CASCADE" })
  game: GameEntity;

  @ManyToOne(() => CustomerEntity, (customer) => customer.rentals, {
    onDelete: "CASCADE",
  })
  customer: CustomerEntity;
}
