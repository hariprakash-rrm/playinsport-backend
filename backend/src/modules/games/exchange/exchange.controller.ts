import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  NotFoundException,
  Put,
  NotAcceptableException,
} from "@nestjs/common";
import { CreateMatchDto } from "./dto/CreateExchangeDto";
import { ExchangeService } from "./exchange.service";
import { AuthGuard } from "@nestjs/passport";
import { UpdateMatchDto } from "./dto/updateExchangeDto";

@Controller("exchange")
@UseGuards(AuthGuard())
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  // POST /exchange
  @Post()
  async create(@Body("name") name: string): Promise<any> {
    try {
      return await this.exchangeService.createExchange(name);
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }

  // PUT /exchange/:id
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

  // GET /exchange/recent
  @Get('recent')
  async getRecent20Data(): Promise<any[]> {
    try {
      const recent20Data = await this.exchangeService.getRecent20Data();
      return recent20Data;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  // GET /exchange/:id
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

  // POST /exchange/:id/match
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

  // PUT /exchange/match/:id
  @Put('match/:id')
  async updateMatch(@Param('id') exchangeId: number, @Body() matchData: any): Promise<any> {
    try {
      const updatedExchange = await this.exchangeService.updateMatch(exchangeId, matchData);
      return updatedExchange;
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }
}
