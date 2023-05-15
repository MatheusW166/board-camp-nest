import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerModule } from "./app/customer/customer.module";
import { GameModule } from "./app/game/game.module";
import { RentalModule } from "./app/rental/rental.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      synchronize: true,
      entities: [`${__dirname}/**/*.entity{.js,.ts}`],
    }),
    CustomerModule,
    GameModule,
    RentalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
