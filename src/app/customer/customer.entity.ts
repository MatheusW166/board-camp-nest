import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RentalEntity } from "../rental/rental.entity";

@Index("customers_primary_key", ["id"], { unique: true })
@Entity({ name: "customers", schema: "public" })
export class CustomerEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("text", { name: "name", nullable: false })
  name: string;

  @Column("text", { name: "phone", nullable: false })
  phone: string;

  @Column("character varying", {
    name: "cpf",
    unique: true,
    length: 11,
    nullable: false,
  })
  cpf: string;

  @Column("date", { name: "birthday", nullable: false })
  birthday: string;

  @OneToMany(() => RentalEntity, (rental) => rental.customer)
  rentals: RentalEntity[];
}

export function isCustomerColumn(columnName: string): boolean {
  return ["name", "cpf", "phone", "birthday"].includes(columnName);
}
