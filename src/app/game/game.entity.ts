import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RentalEntity } from "../rental/rental.entity";

@Index("games_primary_key", ["id"], { unique: true })
@Entity({ name: "games", schema: "public" })
export class GameEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "name", unique: true })
  name: string;

  @Column("text", { name: "image" })
  image: string;

  @Column("integer", { name: "stockTotal" })
  stockTotal: number;

  @Column("integer", { name: "pricePerDay" })
  pricePerDay: number;

  @OneToMany(() => RentalEntity, (rental) => rental.game)
  rentals: RentalEntity[];
}

export function isGameColumn(columnName: string): boolean {
  return ["name", "stockTotal", "pricePerDay"].includes(columnName);
}
