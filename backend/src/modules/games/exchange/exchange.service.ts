import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Exchange } from "./schemas/exchange.schema";

import { User } from "src/modules/auth/schemas/user.schema";

import { AuthService } from "src/modules/auth/auth.service";
import { UpdateMatchDto } from "./dto/updateExchangeDto";

@Injectable()
export class ExchangeService {
  constructor(
    @InjectModel(Exchange.name)
    private readonly exchangeModel: Model<Exchange>,
    @InjectModel(User.name)
    private readonly userModal: Model<Exchange>,
    private authService: AuthService
  ) {}

  async createExchange(name: string): Promise<Exchange> {
    try {
      const exchangesCount = await this.exchangeModel.countDocuments().exec();
      const id = exchangesCount + 1;
      const createdExchange = new this.exchangeModel({ id, name });
      return await createdExchange.save();
    } catch (error) {
      throw new NotAcceptableException("Unable to create exchange");
    }
  }

  async updateExchange(id: number, name: string): Promise<Exchange | null> {
    try {
      const exchange = await this.exchangeModel
        .findOneAndUpdate({ id }, { name })
        .exec();

      if (!exchange) {
        throw new NotFoundException("Exchange not found");
      }

      return exchange;
    } catch (error) {
      throw new NotAcceptableException("Unable to update exchange");
    }
  }

  async findExchangeById(id: number): Promise<Exchange | null> {
    try {
      return await this.exchangeModel.findOne({ id }).exec();
    } catch (error) {
      throw new NotFoundException("Exchange not found");
    }
  }

  async getRecent20Data(): Promise<Exchange[]> {
    try {
      const data = await this.exchangeModel
        .find()
        .sort({ timestamp: -1 })
        .limit(1)
        .exec();

      return data;
    } catch (error) {
      throw new NotFoundException("Failed to fetch recent data");
    }
  }

  async createMatch(exchangeId: number, matchData: any): Promise<Exchange> {
    try {
      const exchange = await this.exchangeModel
        .findOne({ id: exchangeId })
        .exec();

      if (!exchange) {
        throw new NotFoundException("Exchange not found");
      }

      exchange.match = matchData;
      return await exchange.save();
    } catch (error) {
      throw new NotAcceptableException("Unable to create match");
    }
  }

  async updateMatch(exchangeId: number, matchData: any): Promise<Exchange> {
    try {
      const existingExchange = await this.exchangeModel.findOne({
        id: exchangeId,
      });

      if (!existingExchange) {
        throw new Error("Exchange not found");
      }

      // Update the "match" section of the existing exchange
      console.log(matchData);
      existingExchange.match = matchData;

      // Save the updated exchange document
      const updatedExchange = await existingExchange.save();

      return updatedExchange;
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }
}
