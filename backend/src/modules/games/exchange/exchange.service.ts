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
      const createdExchange = new this.exchangeModel(createExchangeDto);
      let count = await this.exchangeModel.countDocuments().exec();
      createdExchange.id = count + 1;
      createdExchange.details = [];
      createdExchange.isFinalized = false;
      createdExchange.message = "";
      return await createdExchange.save();
    } catch (error) {
      throw new InternalServerErrorException(
        "Error creating exchange",
        error.message
      );
    }
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
      throw new InternalServerErrorException(
        "Error finding exchange",
        error.message
      );
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
      throw new InternalServerErrorException(
        "Error fetching exchanges by teams",
        error.message
      );
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
      throw new NotFoundException(
        "Error fetching not finalized exchanges",
        error.message
      );
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
      throw new NotFoundException(
        "Error fetching not finalized exchanges",
        error.message
      );
    }
  }

  async findAll(): Promise<Exchange[]> {
    try {
      const exchanges = await this.exchangeModel.find().exec();
      return exchanges;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "Error fetching exchanges",
        error.message
      );
    }
  }

  async updateExchange(
    id: number,
    updateExchangeDto: UpdateExchangeDto
  ): Promise<Exchange> {
    try {
      const existingExchange: any = await this.exchangeModel
        .findOne({ id })
        .exec();
      if (!existingExchange) {
        throw new NotFoundException("Exchange not found");
      }

      existingExchange.types = updateExchangeDto.types;
      existingExchange.mode = updateExchangeDto.mode;
      existingExchange.team1 = updateExchangeDto.team1;
      existingExchange.team2 = updateExchangeDto.team2;
      existingExchange.odds1 = updateExchangeDto.odds1;
      existingExchange.odds2 = updateExchangeDto.odds2;
      existingExchange.startTime = updateExchangeDto.startTime;
      existingExchange.endTime = updateExchangeDto.endTime;
      existingExchange.isFinalized = updateExchangeDto.isFinalized;
      existingExchange.message = updateExchangeDto.message;

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
      throw new InternalServerErrorException(
        "Error fetching cricket exchanges",
        error.message
      );
    }
  }

  async updateExchangeDetails(
    id: number,
    updateExchangeDto: UpdateDetailDto,
    user: any
  ): Promise<Exchange> {
    try {
      const timestamp = new Date().getTime();
      const existingExchange: any = await this.exchangeModel
        .findOne({ id: id })
        .exec();
      let _user: any = await this.userModal
        .findOne({ number: user.number })
        .exec();
      if (!existingExchange) {
        throw new NotFoundException("Exchange not found");
      }

      if (_user.wallet + _user.reward < updateExchangeDto.amount) {
        throw new NotAcceptableException("Not enough balance");
      }
      let odds: number;
      if (+_user.reward - updateExchangeDto.amount <= 0) {
        let deductwallet = +updateExchangeDto.amount - +_user.reward;
        _user.reward = 0;
        _user.wallet -= deductwallet;
      } else {
        _user.reward -= updateExchangeDto.amount;
      }

      // user.wallet -= +game.tokenPrice
      let txnHistory: any = {
        message: `${existingExchange.types} Prediction - ${existingExchange.mode} - team : ${updateExchangeDto.team}`,
        amount: -updateExchangeDto.amount,
        time: timestamp,
        newBalance: _user.wallet,
      };
      _user.txnHistory.push(txnHistory);
      let details = updateExchangeDto;
      existingExchange.details.push(details);
      if (existingExchange.team1 == updateExchangeDto.team) {
        odds = existingExchange.odds1;
      } else if (existingExchange.team2 == updateExchangeDto.team) {
        odds = existingExchange.odds2;
      } else {
        throw new NotFoundException(
          `Team "${updateExchangeDto.team}" does not match team1 or team2`
        );
      }
      const updatedExchange = await existingExchange.save();
      await _user.save();
      let postData = {
        number: user.number,
        message: `"Hi there! Your bet has been placed. Best of luck!"
        ${existingExchange.types} Prediction - ${existingExchange.mode} 
        team : ${updateExchangeDto.team}
        Rs: ${updateExchangeDto.amount}
        Odds: ${odds}
        `,
      };
      try {
        let data: any;
        const response = await this.authService
          .sendMessage(postData)
          .then((res: any) => {
            data = res;
          });
      } catch {
        console.log("message error-whatsapp");
      }
      return updatedExchange;
    } catch (error) {
      throw new InternalServerErrorException(
        "Error updating exchange details",
        error.message
      );
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
      console.log(existingExchange, team);
      let odds: number;
      let usernumber: string | null = null;

      if (existingExchange.team1 == team) {
        odds = existingExchange.odds1;
      } else if (existingExchange.team2 == team) {
        odds = existingExchange.odds2;
      } else {
        throw new NotFoundException(
          `Team "${team}" does not match team1 or team2`
        );
      }

      for (const detail of existingExchange.details) {
        if (detail.team === team) {
          usernumber = detail.usernumber;
          break;
        }
      }

      if (usernumber === null) {
        throw new NotFoundException(
          "No matching team in exchange details for finalization"
        );
      }

      return { usernumber, odds };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        "Error finalizing exchange",
        error.message
      );
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

      const allUsernumbers = existingExchange.details.map(
        (detail) => detail.usernumber
      );
      return allUsernumbers;
    } catch (error) {
      throw new InternalServerErrorException(
        "Error refunding exchange",
        error.message
      );
    }
  }
}
