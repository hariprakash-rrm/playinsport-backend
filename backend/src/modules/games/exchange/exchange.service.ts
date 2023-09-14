import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateExchangeDto } from "./dto/CreateExchangeDto";
import { Exchange } from "./schemas/exchange.schema";
import { UpdateExchangeDto } from "./dto/updateExchangeDto";

@Injectable()
export class ExchangeService {
  constructor(
    @InjectModel(Exchange.name)
    private readonly exchangeModel: Model<Exchange>
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

  async findById(id: string): Promise<Exchange> {
    try {
      const exchange = await this.exchangeModel.findById(id).exec();
      if (!exchange) {
        throw new NotFoundException("Exchange not found");
      }
      return exchange;
    } catch (error) {
      throw new InternalServerErrorException(
        "Error finding exchange",
        error.message
      );
    }
  }

  async updateExchange(
    id: string,
    updateExchangeDto: UpdateExchangeDto
  ): Promise<Exchange> {
    try {
      const existingExchange: any = await this.exchangeModel
        .findById(id)
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
    updateExchangeDto: UpdateExchangeDto
  ): Promise<Exchange> {
    try {
      const existingExchange: any = await this.exchangeModel
        .findOne({ id: updateExchangeDto.id })
        .exec();
      if (!existingExchange) {
        throw new NotFoundException("Exchange not found");
      }
      existingExchange.details.push(updateExchangeDto.details);
      const updatedExchange = await existingExchange.save();
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
      const existingExchange:any = await this.exchangeModel.findOne({ id }).exec();
      if (!existingExchange) {
        throw new NotFoundException("Exchange not found");
      }

      let odds: number;
      let usernumber: string | null = null;

      if (existingExchange.team1 === team) {
        odds = existingExchange.odds1;
      } else if (existingExchange.team2 === team) {
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
      throw new InternalServerErrorException(
        "Error finalizing exchange",
        error.message
      );
    }
  }

  async refundExchange(id: number): Promise<string[]> {
    try {
      const existingExchange:any = await this.exchangeModel.findOne({ id }).exec();
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
