import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RentalEntity } from "./rental.entity";
import { RentalController } from "./rental.controller";
import { RentalService } from "./rental.service";
import { GameModule } from "../game/game.module";
import { CustomerModule } from "../customer/customer.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([RentalEntity]),
    GameModule,
    CustomerModule,
  ],
  controllers: [RentalController],
  providers: [RentalService],
})
export class RentalModule {}
