import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("rentals_pkey", ["id"], { unique: true })
@Entity("rentals", { schema: "public" })
export class RentalEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "customerId" })
  customerId: number;

  @Column("integer", { name: "gameId" })
  gameId: number;

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
}
