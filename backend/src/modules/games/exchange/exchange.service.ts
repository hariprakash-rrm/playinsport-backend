import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MatchDTO, MatchOddsDTO } from "./dto/exchange.dto";
import { Match } from "./schemas/exchange.schema";

@Injectable()
export class ExchangeService {
  constructor(
    @InjectModel("Exchange") private readonly matchModel: Model<Match>
  ) {}

  async create(matchData: MatchDTO): Promise<Match> {
    try {
      const createdMatch = new this.matchModel(matchData);
      return await createdMatch.save();
    } catch (error) {
      throw new Error(`Failed to create match: ${error.message}`);
    }
  }

  async findAll(): Promise<Match[]> {
    try {
      return await this.matchModel.find().exec();
    } catch (error) {
      throw new Error(`Failed to retrieve matches: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const match = await this.matchModel.findById(id).exec();
      if (!match) {
        throw new NotFoundException(`Match with ID ${id} not found`);
      }
      return match;
    } catch (error) {
      throw new Error(`Failed to retrieve match: ${error.message}`);
    }
  }

  async update(id: string, matchData: MatchDTO): Promise<Match> {
    try {
      const updatedMatch = await this.matchModel
        .findByIdAndUpdate(id, matchData, { new: true })
        .exec();
      if (!updatedMatch) {
        throw new NotFoundException(`Match with ID ${id} not found`);
      }
      return updatedMatch;
    } catch (error) {
      throw new Error(`Failed to update match: ${error.message}`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.matchModel.findByIdAndRemove(id).exec();
      if (!result) {
        throw new NotFoundException(`Match with ID ${id} not found`);
      }
    } catch (error) {
      throw new Error(`Failed to delete match: ${error.message}`);
    }
  }

  async placeOdds(id: string, oddsData: MatchOddsDTO): Promise<Match> {
    try {
      const match: any = await this.matchModel.findById(id).exec();
      if (!match) {
        throw new Error(`Match with ID ${id} not found`);
      }

      // Update odds and user information
      match.team1Odds = oddsData.team1Odds;
      match.team2Odds = oddsData.team2Odds;
      match.details.push({
        teamname: match.team1, // You can update this based on the team associated with the odds
        teamodds: oddsData.team1Odds,
        username: oddsData.username,
        usernumber: oddsData.userPhoneNumber,
        amount: oddsData.amount, // Include the provided amount
      });

      // Save the updated match
      return await match.save();
    } catch (error) {
      throw new Error(`Failed to place odds: ${error.message}`);
    }
  }

  async finalizeMatch(id: string, winningTeam: string): Promise<Match> {
    try {
      const match:any = await this.matchModel.findById(id).exec();
      if (!match) {
        throw new Error(`Match with ID ${id} not found`);
      }

      // Set the winner field to the provided winning team
      match.winner = winningTeam;

      // Find the winning and losing odds
      let winningOdds = 0;
      let losingOdds = 0;
      if (winningTeam === match.team1) {
        winningOdds = match.team1Odds;
        losingOdds = match.team2Odds;
      } else if (winningTeam === match.team2) {
        winningOdds = match.team2Odds;
        losingOdds = match.team1Odds;
      }

      // Update user wallets based on the winning odds and amount
      for (const detail of match.details) {
        if (detail.teamname === winningTeam) {
          // Calculate the amount to add to the user's wallet
          const winnings = detail.amount * winningOdds;
          // You need to implement user wallet logic to add the winnings to the user
          // For example, you can call a user wallet service method here
          // userWalletService.addWinnings(detail.username, winnings);
        } else {
          // You can deduct the amount from the loser's wallet if needed
          // For example, you can call a user wallet service method here
          // userWalletService.deductLoss(detail.username, detail.amount);
        }
      }

      // Set match as finalized
      match.isfinalised = true;

      // Save the updated match
      return await match.save();
    } catch (error) {
      throw new Error(`Failed to finalize match: ${error.message}`);
    }
  }

  async getMatchesByDate(date: Date): Promise<Match[]> {
    try {
      return await this.matchModel.find({ matchDate: date }).exec();
    } catch (error) {
      throw new Error(`Failed to retrieve matches by date: ${error.message}`);
    }
  }
}
