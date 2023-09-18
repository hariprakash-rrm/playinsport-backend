import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateExchangeDto } from "./dto/CreateExchangeDto";
import { Exchange } from "./schemas/exchange.schema";
import { UpdateDetailDto, UpdateExchangeDto } from "./dto/updateExchangeDto";
import { User } from "src/modules/auth/schemas/user.schema";
import { throwIfEmpty } from "rxjs";
import { AuthService } from "src/modules/auth/auth.service";

@Injectable()
export class ExchangeService {
  constructor(
    @InjectModel(Exchange.name)
    private readonly exchangeModel: Model<Exchange>,
    @InjectModel(User.name)
    private readonly userModal: Model<Exchange>,
    private authService: AuthService
  ) {}
  async createExchange(
    createExchangeDto: CreateExchangeDto
  ): Promise<Exchange> {
    try {
      // const createdExchange = new this.exchangeModel(createExchangeDto);
      const exchange: any = await this.exchangeModel.findOne({ id: 1 }).exec();
      console.log(createExchangeDto);
      exchange.match.push(createExchangeDto);
      return await exchange.save();
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }

  async initialMatch(name: string): Promise<any> {
    const createdExchange = new this.exchangeModel({ name });
    let count = await this.exchangeModel.countDocuments().exec();
    createdExchange.id = count + 1;
    return await createdExchange.save();
  }

  async findById(id: number): Promise<Exchange> {
    try {
      const exchange = await this.exchangeModel.findOne({ id }).exec();
      if (!exchange) {
        throw new NotFoundException("Exchange not found");
      }
      if (exchange.isFinalized) {
        throw new NotFoundException("Exchange not found");
      }
      return exchange;
    } catch (error) {
      console.log(error);
      throw new NotAcceptableException(error);
    }
  }

  async findExchangesByTeams(
    team1: string,
    team2: string
  ): Promise<Exchange[]> {
    try {
      let query: any = { isFinalized: false };

      if (team1) {
        query.team1 = team1;
      }

      if (team2) {
        query.team2 = team2;
      }

      const exchanges = await this.exchangeModel.find(query).exec();

      return exchanges;
    } catch (error) {
      console.error(error);
      throw new NotAcceptableException(error);
    }
  }

  async findLive(): Promise<Exchange[]> {
    try {
      const exchanges = await this.exchangeModel
        .find({ where: { isFinalized: false } })
        .exec();
      return exchanges;
    } catch (error) {
      console.error(error);
      throw new NotAcceptableException(error);
    }
  }

  async findCompleted(): Promise<Exchange[]> {
    try {
      const exchanges = await this.exchangeModel
        .find({ where: { isFinalized: true } })
        .exec();
      return exchanges;
    } catch (error) {
      console.error(error);
      throw new NotAcceptableException(error);
    }
  }

  async findExchangesByNumber(usernumber: number): Promise<any[]> {
    console.log(usernumber);
    try {
      const exchange = await this.exchangeModel.findOne({ id: 1 }).exec();

      if (!exchange) {
        throw new NotFoundException(`Exchange with id  not found`);
      }

      const matchingDetails = exchange.match[0].details.filter(
        (detail: any) => detail.usernumber === +usernumber
      );
      return matchingDetails;
    } catch (error) {
      console.error(error);
      throw new NotAcceptableException(error.message || "An error occurred");
    }
  }

  async findAll(): Promise<Exchange[]> {
    try {
      const exchanges = await this.exchangeModel.find().exec();
      return exchanges;
    } catch (error) {
      console.error(error);
      throw new NotAcceptableException(error);
    }
  }

  async updateExchange(
    id: number,
    updateExchangeDto: UpdateExchangeDto
  ): Promise<Exchange> {
    console.log(updateExchangeDto);
    try {
      const existingExchange: any = await this.exchangeModel
        .findOne({ id })
        .exec();
      if (!existingExchange) {
        throw new NotFoundException("Exchange not found");
      }
      existingExchange.match[0] = updateExchangeDto;
      
      console.log(existingExchange[0]);
      const updatedExchange = await existingExchange.save();
      return updatedExchange;
    } catch (error) {
      throw new InternalServerErrorException(
        "Error updating exchange",
        error.message
      );
    }
  }

  async getCricketExchanges(): Promise<Exchange[]> {
    try {
      const cricketExchanges = await this.exchangeModel
        .find({ types: "cricket" })
        .exec();

      if (cricketExchanges.length === 0) {
        throw new NotFoundException("No cricket exchanges found");
      }

      return cricketExchanges;
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }

  async updateExchangeDetails(id, updateExchangeDto: any, user) {
    try {
      const timestamp = new Date().getTime();
      const exchange: any = await this.exchangeModel.findOne({ id }).exec();

      if (!exchange) {
        throw new NotFoundException("Exchange not found");
      }

      const userToUpdate: any = await this.userModal
        .findOne({ number: user.number })
        .exec();

      if (!userToUpdate) {
        throw new NotFoundException("User not found");
      }

      const { wallet, reward }: any = userToUpdate;

      if (wallet + reward < updateExchangeDto.amount) {
        throw new NotAcceptableException("Not enough balance");
      }

      let odds: any;

      if (reward >= updateExchangeDto.amount) {
        userToUpdate.reward -= updateExchangeDto.amount;
      } else {
        const deductWallet = updateExchangeDto.amount - reward;
        userToUpdate.reward = 0;
        userToUpdate.wallet -= deductWallet;
      }

      await userToUpdate.save();

      const txnHistory = {
        message: `${exchange.types} Prediction - ${exchange.mode} - team : ${updateExchangeDto.team}`,
        amount: -updateExchangeDto.amount,
        time: timestamp,
        newBalance: userToUpdate.wallet,
      };

      userToUpdate.txnHistory.push(txnHistory);

      const details: any = updateExchangeDto;
      exchange.details.push(details);

      if (exchange.team1 === updateExchangeDto.team) {
        odds = exchange.odds1;
      } else if (exchange.team2 === updateExchangeDto.team) {
        odds = exchange.odds2;
      } else {
        throw new NotFoundException(
          `Team "${updateExchangeDto.team}" does not match team1 or team2`
        );
      }

      const updatedExchange = await exchange.save();

      return updatedExchange;
    } catch (error) {
      throw new NotAcceptableException(error.message || "An error occurred");
    }
  }

  async finalizeExchange(id: number, team: string): Promise<any> {
    try {
      const existingExchange: any = await this.exchangeModel
        .findOne({ id: id })
        .exec();
      if (!existingExchange) {
        throw new NotFoundException("Exchange not found");
      }
      if (existingExchange.isFinalized) {
        throw new NotFoundException("Exchange Already finalized");
      }
      console.log(existingExchange, team);
      let odds: number;

      if (existingExchange.team1 == team) {
        odds = existingExchange.odds1;
      } else if (existingExchange.team2 == team) {
        odds = existingExchange.odds2;
      } else {
        throw new NotFoundException(
          `Team "${team}" does not match team1 or team2`
        );
      }

      const filteredDetails = existingExchange.details
        .filter((detail) => detail.team === team)
        .map((detail) => ({
          usernumber: detail?.usernumber,
          amount: detail?.amount,
        }));

      // usernumber now contains an array of usernumber values that meet the condition

      if (filteredDetails === null) {
        throw new NotFoundException(
          "No matching team in exchange details for finalization"
        );
      }
      const userAmounts = {};

      for (const entry of filteredDetails) {
        const { usernumber, amount } = entry;

        // Initialize the cumulative amount for the user if not already initialized
        if (!userAmounts[usernumber]) {
          userAmounts[usernumber] = 0;
        }

        // Accumulate the amount for the user
        userAmounts[usernumber] += amount;
      }

      const userWallets = {};
      const updateUserPromises = [];

      for (const phoneNumber in userAmounts) {
        if (userAmounts.hasOwnProperty(phoneNumber)) {
          const accumulatedAmount = userAmounts[phoneNumber];

          // Find the user based on their phone number
          const user: any = await this.userModal
            .findOne({ number: phoneNumber })
            .exec();

          if (user) {
            // Add the accumulated amount to the user's wallet
            user.wallet += accumulatedAmount * odds;

            // Save the updated user
            updateUserPromises.push(user.save());

            console.log(
              `User with phone number ${phoneNumber}: Wallet updated to ${user.wallet}`
            );
          }
        }
      }

      // Execute the promises in parallel
      await Promise.all(updateUserPromises);
      // existingExchange.isFinalized = true;
      await existingExchange.save();
      return { userWallets, odds };
    } catch (error) {
      console.log(error);
      throw new NotAcceptableException(error);
    }
  }

  async refundExchange(id: number): Promise<string[]> {
    try {
      const existingExchange: any = await this.exchangeModel
        .findOne({ id: id })
        .exec();
      if (!existingExchange) {
        throw new NotFoundException("Exchange not found");
      }
      if (existingExchange.isFinalized) {
        throw new NotFoundException("Exchange Already finalized");
      }

      const userDetails = existingExchange.details.map((detail) => ({
        usernumber: detail.usernumber,
        amount: detail.amount,
      }));

      const userAmounts = {};

      for (const userDetail of userDetails) {
        const { usernumber, amount } = userDetail;

        // Initialize the cumulative amount for the user if not already initialized
        if (!userAmounts[usernumber]) {
          userAmounts[usernumber] = 0;
        }

        // Accumulate the amount for the user
        userAmounts[usernumber] += amount;
      }

      // Find users and update their wallets
      const updateUserPromises = [];

      for (const usernumber in userAmounts) {
        if (userAmounts.hasOwnProperty(usernumber)) {
          const accumulatedAmount = userAmounts[usernumber];

          // Find the user based on their phone number
          const user: any = await this.userModal
            .findOne({ number: usernumber })
            .exec();

          if (user) {
            // Add the accumulated amount to the user's wallet
            user.wallet += accumulatedAmount;

            // Save the updated user
            updateUserPromises.push(user.save());

            console.log(
              `User with phone number ${usernumber}: Wallet updated to ${user.wallet}`
            );
          }
        }
      }

      // Execute the promises in parallel
      await Promise.all(updateUserPromises);
      existingExchange.isFinalized = true;
      await existingExchange.save();
      return userDetails;
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }
}
