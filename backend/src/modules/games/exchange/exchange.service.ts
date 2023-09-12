import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


import { CreateExchangeDto } from './dto/CreateExchangeDto';
import { Exchange } from './schemas/exchange.schema';

@Injectable()
export class ExchangeService {
  constructor(
    @InjectModel(Exchange.name)
    private readonly exchangeModel: Model<Exchange>,
  ) {}

  async createExchange(createExchangeDto: CreateExchangeDto): Promise<Exchange> {
    try {
      const createdExchange = new this.exchangeModel(createExchangeDto);
      return await createdExchange.save();
    } catch (error) {
      throw new InternalServerErrorException('Error creating exchange', error.message);
    }
  }
}
