import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
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
      let createdExchange = await new this.exchangeModel({
        id,
        name,
        isFinalized: false,
        gameType: 0,
      });
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

  async findUnfinalizedExchanges(): Promise<Exchange[]> {
    try {
      const unfinalizedExchanges = await this.exchangeModel
        .find({ isFinalized: false })
        .exec();
      return unfinalizedExchanges;
    } catch (error) {
      throw new NotFoundException("Unable to retrieve unfinalized exchanges");
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
      exchange.match.details = [];
      return await exchange.save();
    } catch (error) {
      throw new NotAcceptableException("Unable to create match");
    }
  }

  async updateMatch(
    exchangeId: number,
    matchData: UpdateMatchDto
  ): Promise<Exchange> {
    try {
      let existingExchange: any = await this.exchangeModel
        .findOne({
          id: exchangeId,
        })
        .exec();

      if (!existingExchange) {
        throw new NotFoundException("Exchange not found");
      }

      // Update the "details" property within the "match" object
      existingExchange.team1 = matchData.team1;
      existingExchange.team2 = matchData.team2;
      existingExchange.odds1 = matchData.odds1;
      existingExchange.odds2 = matchData.odds2;
      existingExchange.startTime = matchData.startTime;
      existingExchange.endTime = matchData.endTime;
      existingExchange.isFinalized = matchData.isFinalized;
      existingExchange.markModified("match");
      await existingExchange.save();
      console.log(existingExchange.match.details);
      // Save the updated exchange document
      const updatedExchange = await existingExchange.save();

      return updatedExchange;
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }

  async predictMatch(id: number, _user: any, detials: any): Promise<any> {
    try {
      let existingExchange: any = await this.exchangeModel
        .findOne({
          id: id,
        })
        .exec();

      if (!existingExchange) {
        throw new NotFoundException("Exchange not found");
      }
      let user: any = await this.userModal.findOne({ number: _user.number });
      // console.log(user)
      if (+user.reward + +user.wallet >= +detials.amount) {
        if (+user.reward - +detials.amount <= 0) {
          let deductwallet = +detials.amount - +user.reward;
          user.reward = 0;
          user.wallet -= +deductwallet;
        } else {
          user.reward -= +detials.amount;
        }
        // user.markModified()
        console.log(user);
      } else {
        throw new NotAcceptableException("Not enough balance");
      }
      existingExchange.match.details.push(detials);
      existingExchange.markModified("match");
      await existingExchange.save();
      await user.save();
      console.log(existingExchange.match.details);
      // Save the updated exchange document
      const updatedExchange = await existingExchange.save();

      return updatedExchange;
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }
}
