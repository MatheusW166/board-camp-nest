import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("games_pkey", ["id"], { unique: true })
@Entity("games", { schema: "public" })
export class GameEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "name" })
  name: string;

  @Column("text", { name: "image" })
  image: string;

  @Column("integer", { name: "stockTotal" })
  stockTotal: number;

  @Column("integer", { name: "pricePerDay" })
  pricePerDay: number;
}
