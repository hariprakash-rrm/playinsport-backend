import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Request,
  UseGuards,
  Get,
  Param,
  NotFoundException,
  InternalServerErrorException,
  Put,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateExchangeDto } from "./dto/CreateExchangeDto";
import { ExchangeService } from "./exchange.service";
import { AuthGuard } from "@nestjs/passport";
import { UpdateDetailDto, UpdateExchangeDto } from "./dto/updateExchangeDto";

@Controller("exchange")
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post("/create")
  @UseGuards(AuthGuard())
  async create(@Body() createExchangeDto: CreateExchangeDto) {
    try {
      const createdExchange = await this.exchangeService.createExchange(
        createExchangeDto
      );
      return createdExchange;
    } catch (error) {
      throw new BadRequestException("Invalid input data", error.message);
    }
  }

  @Get("get/:id")
  async findById(@Param("id") id: number) {
    try {
      const exchange = await this.exchangeService.findById(id);
      return exchange;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Rethrow NotFoundException if exchange is not found
      }
      throw new InternalServerErrorException(
        "Error finding exchange",
        error.message
      );
    }
  }

  @Get("filter")
  async filterExchanges(
    @Query("team1") team1: string,
    @Query("team2") team2: string
  ): Promise<any[]> {
    try {
      const exchanges = await this.exchangeService.findExchangesByTeams(
        team1,
        team2
      );
      return exchanges;
    } catch (error) {
      throw new InternalServerErrorException(
        "Error fetching filtered exchanges",
        error.message
      );
    }
  }

  // @Get()
  // async getAll() {
  //   try {
  //     const exchanges = await this.exchangeService.findAll(); // Assuming you have a findAll method in your service
  //     return exchanges;
  //   } catch (error) {
  //     throw new InternalServerErrorException('Error fetching exchanges', error.message);
  //   }
  // }

  @Get("/live")
  async getLive() {
    try {
      const exchanges = await this.exchangeService.findLive(); // Assuming you have a findAll method in your service
      return exchanges;
    } catch (error) {
      throw new InternalServerErrorException(
        "Error fetching exchanges",
        error.message
      );
    }
  }
  @Get("/completed")
  async getCompleted(@Param("id") id: number) {
    try {
      const exchanges = await this.exchangeService.findCompleted(); // Assuming you have a findAll method in your service
      return exchanges;
    } catch (error) {
      throw new InternalServerErrorException(
        "Error fetching exchanges",
        error.message
      );
    }
  }

  @Put(":id")
  async updateById(
    @Param("id") id: number,
    @Body() updateExchangeDto: UpdateExchangeDto
  ) {
    try {
      const updatedExchange = await this.exchangeService.updateExchange(
        id,
        updateExchangeDto
      );
      return updatedExchange;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error updating exchange",
        error.message
      );
    }
  }

  @Get("cricket")
  async getCricketExchanges() {
    try {
      const cricketExchanges = await this.exchangeService.getCricketExchanges();
      return cricketExchanges;
    } catch (error) {
      throw error; // Rethrow exceptions from the service
    }
  }

  @Post("update-details/:id")
  async updateExchangeDetails(
    @Request() req:any,
    @Param("id") id: number,
    @Body() updateExchangeDto: UpdateDetailDto
  ) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException("You are not an valid user");
    }
   
    try {
      const updatedExchange = await this.exchangeService.updateExchangeDetails(
        id,
        updateExchangeDto,
        user
      );
      return updatedExchange;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error updating exchange details",
        error.message
      );
    }
  }

  @Put("finalize/:id/:team")
  async finalizeExchange(@Param("id") id: number, @Param("team") team: string) {
    try {
      const result = await this.exchangeService.finalizeExchange(id, team);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error finalizing exchange",
        error.message
      );
    }
  }

  @Put("refund/:id")
  async refundExchange(@Param("id") id: number) {
    try {
      const result = await this.exchangeService.refundExchange(id);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error refunding exchange",
        error.message
      );
    }
  }
}
