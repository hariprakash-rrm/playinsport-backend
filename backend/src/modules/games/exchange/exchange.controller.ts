import { Controller, Post, Body, BadRequestException, Request, UseGuards } from '@nestjs/common';
import { CreateExchangeDto } from './dto/CreateExchangeDto';
import { ExchangeService } from './exchange.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post()
  @UseGuards(AuthGuard())
  async create(@Body() createExchangeDto: CreateExchangeDto) {
    try {
      const createdExchange = await this.exchangeService.createExchange(createExchangeDto);
      return createdExchange;
    } catch (error) {
      throw new BadRequestException('Invalid input data', error.message);
    }
  }

  @UseGuards(AuthGuard())
  getProfile(@Request() req:any) {
    console.log(req)
    const user = req.user; // Access the authenticated user from the request

    if (user.isAdmin) {
      // Handle the scenario for admin users
      return { message: 'Admin profile', user };
    } else {
      // Handle the scenario for non-admin users
      return { message: 'User profile', user };
    }
  }
}
