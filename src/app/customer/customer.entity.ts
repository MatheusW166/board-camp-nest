import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("customers_pkey", ["id"], { unique: true })
@Entity("customers", { schema: "public" })
export class CustomerEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("text", { name: "name", nullable: false })
  name: string;

  @Column("text", { name: "phone", nullable: false })
  phone: string;

  @Column("character varying", { name: "cpf", length: 11, nullable: false })
  cpf: string;

  @Column("date", { name: "birthday", nullable: false })
  birthday: string;
}

export function isCustomerColumn(columnName: string): boolean {
  return ["name", "cpf", "phone", "birthday"].includes(columnName);
}
