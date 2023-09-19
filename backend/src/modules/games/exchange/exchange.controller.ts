import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  NotFoundException,
  Put,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  NotAcceptableException,
} from "@nestjs/common";
import { CreateMatchDto } from "./dto/CreateExchangeDto";
import { ExchangeService } from "./exchange.service";
import { AuthGuard } from "@nestjs/passport";
import { UpdateMatchDto } from "./dto/updateExchangeDto";
const userLockFlags = new Map<string, boolean>();
@Controller("exchange")
@UseGuards(AuthGuard())
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post()
  async create(@Body("name") name: string): Promise<any> {
    try {
      return await this.exchangeService.createExchange(name);
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }

  @Put(':id')
  async updateExchange(@Param('id') id: number, @Body('name') name: string): Promise<any> {
    try {
      const updatedExchange = await this.exchangeService.updateExchange(id, name);

      if (!updatedExchange) {
        throw new NotFoundException(`Exchange with ID ${id} not found`);
      }

      return updatedExchange;
    } catch (error) {
      throw new NotFoundException(error.message || 'Unable to update exchange');
    }
  }

  @Get(":id")
  async findById(@Param("id") id: number): Promise<any | null> {
    try {
      const exchange = await this.exchangeService.findExchangeById(id);
      if (!exchange) {
        throw new NotFoundException("Exchange not found");
      }
      return exchange;
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }

  @Post(":id/match")
  async createMatch(
    @Param("id") id: number,
    @Body() matchData: CreateMatchDto
  ): Promise<any> {
    try {
      return await this.exchangeService.createMatch(id, matchData);
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }

  @Put(':id')
  async updateMatch(@Param('id') exchangeId: number, @Body() matchData: any): Promise<any> {
    try {
      const updatedExchange = await this.exchangeService.updateMatch(exchangeId, matchData);
      return updatedExchange;
    } catch (error) {
      // Handle errors, e.g., return an error response
      throw new NotAcceptableException(error)
    }
  }
}
