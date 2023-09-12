import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Query } from '@nestjs/common';

import { ExchangeService } from './exchange.service';
import { MatchDTO, MatchOddsDTO } from './dto/exchange.dto';
import { Match } from './schemas/exchange.schema';
import { NotFoundError } from 'rxjs';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly matchService: ExchangeService) {}

  @Post()
  async create(@Body() matchData: MatchDTO): Promise<Match> {
    try {
      const createdMatch = await this.matchService.create(matchData);
      return createdMatch;
    } catch (error) {
      throw new Error(`Failed to create match: ${error.message}`);
    }
  }

  @Get()
  async findAll(): Promise<Match[]> {
    try {
      const matches = await this.matchService.findAll();
      return matches;
    } catch (error) {
      throw new NotFoundException(`Failed to retrieve matches: ${error.message}`);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      // Check if the ID is not in the correct ObjectId format
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    try {
      const match = await this.matchService.findOne(id);
      if (!match) {
        throw new NotFoundException(`Match with ID ${id} not found`);
      }
      return match;
    } catch (error) {
      throw new Error(`Failed to retrieve match: ${error.message}`);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() matchData: MatchDTO): Promise<Match> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        // Check if the ID is not in the correct ObjectId format
        throw new NotFoundException(`Match with ID ${id} not found`);
      }
    try {
      const updatedMatch = await this.matchService.update(id, matchData);
      return updatedMatch;
    } catch (error) {
      throw new Error(`Failed to update match: ${error.message}`);
    }
  }

  @Get('by-date')
  async getMatchesByDate(@Query('date') date: string): Promise<Match[]> {
    try {
      const matches = await this.matchService.getMatchesByDate(new Date(date));
      return matches;
    } catch (error) {
      throw new Error(`Failed to retrieve matches by date: ${error.message}`);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        // Check if the ID is not in the correct ObjectId format
        throw new NotFoundException(`Match with ID ${id} not found`);
      }
    try {
      await this.matchService.remove(id);
    } catch (error) {
      throw new Error(`Failed to delete match: ${error.message}`);
    }
  }

  @Post(':id/place-odds')
  async placeOdds(@Param('id') id: string, @Body() oddsData: MatchOddsDTO): Promise<any> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        // Check if the ID is not in the correct ObjectId format
        throw new NotFoundException(`Match with ID ${id} not found`);
      }
    try {
      const updatedMatch = await this.matchService.placeOdds(id, oddsData);
      return updatedMatch;
    } catch (error) {
      throw new Error(`Failed to place odds: ${error.message}`);
    }
  }
}
