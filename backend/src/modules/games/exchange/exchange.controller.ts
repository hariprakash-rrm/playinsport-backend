import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Request,
  UseGuards,
  Get,
  Param,
  NotFoundException,
  InternalServerErrorException,
  Put,
  Query,
  UnauthorizedException,
  NotAcceptableException,
} from "@nestjs/common";
import { CreateExchangeDto } from "./dto/CreateExchangeDto";
import { ExchangeService } from "./exchange.service";
import { AuthGuard } from "@nestjs/passport";
import { UpdateDetailDto, UpdateExchangeDto } from "./dto/updateExchangeDto";
import * as cache from "memory-cache";
import { RateLimit } from "./rate-limit.decarator";
const userLockFlags = new Map<string, boolean>();
@Controller("exchange")
@UseGuards(AuthGuard())
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post("/create")
  async create(
    @Request() req: any,
    @Body() createExchangeDto: CreateExchangeDto
  ) {
    const user = await req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("Not an admin");
    }
    try {
      const createdExchange = await this.exchangeService.createExchange(
        createExchangeDto
      );
      return createdExchange;
    } catch (error) {
      throw new BadRequestException("Invalid input data", error.message);
    }
  }

  @Post("initial-match")
  async initialMatch(
    @Request() req: any,
    @Body("name") name: string
  ): Promise<any> {
    const user = await req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("Not an admin");
    }
    const createdExchange = await this.exchangeService.initialMatch(name);
    return createdExchange;
  }

  @Get("get/:id/:subId") // Define the route with two parameters
  async findById(@Param("id") id: number, @Param("subId") subId: string) {
    try {
      // Now you have access to both 'id' and 'subId' parameters
      // You can use them as needed in your logic
      console.log("Received id:", id);
      console.log("Received subId:", subId);
      try {
        const exchange = await this.exchangeService.findById(id);
        let match = exchange.match[subId];
        return match;
      } catch (error) {
        throw new NotAcceptableException("NO game found");
      }
      // Your logic here...

      // Example: Return a response with both 'id' and 'subId'
      return { id, subId };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Rethrow NotFoundException if needed
      }
      throw new InternalServerErrorException(
        "Error finding exchange",
        error.message
      );
    }
  }

  @Get("filter")
  async filterExchanges(
    @Query("team1") team1: string,
    @Query("team2") team2: string
  ): Promise<any[]> {
    try {
      const exchanges = await this.exchangeService.findExchangesByTeams(
        team1,
        team2
      );
      return exchanges;
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }

  // @Get()
  // async getAll() {
  //   try {
  //     const exchanges = await this.exchangeService.findAll(); // Assuming you have a findAll method in your service
  //     return exchanges;
  //   } catch (error) {
  //     throw new InternalServerErrorException('Error fetching exchanges', error.message);
  //   }
  // }

  @Get("/live")
  async getLive() {
    try {
      const exchanges = await this.exchangeService.findLive(); // Assuming you have a findAll method in your service
      return exchanges;
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }
  @Get("/completed")
  async getCompleted(@Param("id") id: number) {
    try {
      const exchanges = await this.exchangeService.findCompleted(); // Assuming you have a findAll method in your service
      return exchanges;
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }

  @Put(":id")
  async updateById(
    @Request() req: any,
    @Param("id") id: number,
    @Body() updateExchangeDto: UpdateExchangeDto
  ) {
    const user = await req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("Not an admin");
    }
    try {
      const updatedExchange = await this.exchangeService.updateExchange(
        id,
        updateExchangeDto
      );
      return updatedExchange;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotAcceptableException(error);
    }
  }

  @Get("cricket")
  async getCricketExchanges() {
    try {
      const cricketExchanges = await this.exchangeService.getCricketExchanges();
      return cricketExchanges;
    } catch (error) {
      throw error; // Rethrow exceptions from the service
    }
  }

  @Post("update-details/:id")
  async updateExchangeDetails(
    @Request() req: any,
    @Param("id") id: number,
    @Body() updateExchangeDto: UpdateDetailDto
  ) {
    const user = await req.user;
    if (userLockFlags.get(user.number)) {
      throw new NotAcceptableException("User is already processing a request");
    }

    console.log(user, "user");
    try {
      userLockFlags.set(user.number, true);
      const updatedExchange = await this.exchangeService.updateExchangeDetails(
        id,
        updateExchangeDto,
        user
      );
      return await updatedExchange;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotAcceptableException(error);
    } finally {
      // Clear the user's lock flag after the request is complete
      userLockFlags.delete(user.number);
    }
  }
  @Get("by-number/:usernumber")
  async findExchangesByNumber(
    @Param("usernumber") usernumber: number
  ): Promise<any[]> {
    try {
      const exchanges = await this.exchangeService.findExchangesByNumber(
        usernumber
      );
      return exchanges;
    } catch (error) {
      // Handle errors here, e.g., return an error response
      console.error(error);
      throw new NotAcceptableException(error);
    }
  }

  @Put("finalize/:id/:team")
  async finalizeExchange(
    @Request() req: any,
    @Param("id") id: number,
    @Param("team") team: string
  ) {
    const user = await req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("Not an admin");
    }
    if (userLockFlags.get(user.number)) {
      throw new NotAcceptableException("User is already processing a request");
    }
    try {
      userLockFlags.set(user.number, true);
      const result = await this.exchangeService.finalizeExchange(id, team);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotAcceptableException(error);
    } finally {
      // Clear the user's lock flag after the request is complete
      userLockFlags.delete(user.number);
    }
  }

  @Put("refund/:id")
  async refundExchange(@Request() req: any, @Param("id") id: number) {
    const user = await req.user;
    if (userLockFlags.get(user.number)) {
      throw new NotAcceptableException("User is already processing a request");
    }
    try {
      userLockFlags.set(user.number, true);
      const result = await this.exchangeService.refundExchange(id);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotAcceptableException(error);
    } finally {
      // Clear the user's lock flag after the request is complete
      userLockFlags.delete(user.number);
    }
  }
}
