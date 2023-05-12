import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerModule } from "./app/customer/customer.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      synchronize: false,
      entities: [`${__dirname}/**/*.entity{.js,.ts}`],
    }),
    CustomerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
