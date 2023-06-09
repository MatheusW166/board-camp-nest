import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
} from "@nestjs/common";
import { GameService } from "./game.service";
import { FindAllGameDto } from "./dto/findAllGame.dto";
import { CreateGameDto, createGameSchema } from "./dto/createGame.dto";
import { ValidationPipe } from "../../pipes/validation.pipe";
import { GameEntity } from "./game.entity";

@Controller("games")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @UsePipes(new ValidationPipe(createGameSchema))
  async create(@Body() data: CreateGameDto): Promise<GameEntity> {
    return this.gameService.create(data);
  }

  @Get()
  async findAll(@Query() query: FindAllGameDto): Promise<GameEntity[]> {
    return this.gameService.findAll(query);
  }

  @Get(":id")
  async findById(@Param("id") id: number): Promise<GameEntity> {
    return this.gameService.findById(id);
  }
}
