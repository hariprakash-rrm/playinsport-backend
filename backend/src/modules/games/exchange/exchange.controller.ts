import { Controller, Post, Body, BadRequestException, Request, UseGuards, Get, Param, NotFoundException, InternalServerErrorException, Put } from '@nestjs/common';
import { CreateExchangeDto } from './dto/CreateExchangeDto';
import { ExchangeService } from './exchange.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateExchangeDto } from './dto/updateExchangeDto';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post('/create')
  @UseGuards(AuthGuard())
  async create(@Body() createExchangeDto: CreateExchangeDto) {
    try {
      const createdExchange = await this.exchangeService.createExchange(createExchangeDto);
      return createdExchange;
    } catch (error) {
      throw new BadRequestException('Invalid input data', error.message);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const exchange = await this.exchangeService.findById(id);
      return exchange;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Rethrow NotFoundException if exchange is not found
      }
      throw new InternalServerErrorException('Error finding exchange', error.message);
    }
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() updateExchangeDto: UpdateExchangeDto) {
    try {
      const updatedExchange = await this.exchangeService.updateExchange(id, updateExchangeDto);
      return updatedExchange;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating exchange', error.message);
    }
  }

  @Get('cricket')
  async getCricketExchanges() {
    try {
      const cricketExchanges = await this.exchangeService.getCricketExchanges();
      return cricketExchanges;
    } catch (error) {
      throw error; // Rethrow exceptions from the service
    }
  }

  @Put('update-details')
  async updateExchangeDetails(@Body() updateExchangeDto: UpdateExchangeDto) {
    try {
      const updatedExchange = await this.exchangeService.updateExchangeDetails(updateExchangeDto);
      return updatedExchange;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating exchange details', error.message);
    }
  }

  @Put('finalize/:id/:team')
  async finalizeExchange(
    @Param('id') id: number,
    @Param('team') team: string,
  ) {
    try {
      const result = await this.exchangeService.finalizeExchange(id, team);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error finalizing exchange', error.message);
    }
  }

  @Put('refund/:id')
  async refundExchange(@Param('id') id: number) {
    try {
      const result = await this.exchangeService.refundExchange(id);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error refunding exchange', error.message);
    }
  }

  
}
