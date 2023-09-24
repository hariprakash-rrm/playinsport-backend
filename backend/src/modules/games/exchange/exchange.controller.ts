import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  NotFoundException,
  Put,
  NotAcceptableException,
  Request,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { CreateMatchDto } from "./dto/CreateExchangeDto";
import { ExchangeService } from "./exchange.service";
import { AuthGuard } from "@nestjs/passport";
import { UpdateMatchDto } from "./dto/updateExchangeDto";
const userLockFlags = new Map<string, boolean>();

@Controller("exchange")
@UseGuards(AuthGuard())
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  // POST /exchange
  @Post()
  async create(@Request() req: any,@Body("name") name: string): Promise<any> {
    const user = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    try {
      return await this.exchangeService.createExchange(name);
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }

  // PUT /exchange/:id
  @Put(':id')
  async updateExchange(@Request() req:any,@Param('id') id: number, @Body('name') name: string): Promise<any> {
    const user = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    try {
      const updatedExchange = await this.exchangeService.updateExchange(id, name);

      if (!updatedExchange) {
        throw new NotFoundException(`Exchange with ID ${id} not found`);
      }

      return updatedExchange;
    } catch (error) {
      throw new NotFoundException(error.message || 'Unable to update exchange');
    }
  }


  @Get('unfinalized')
  async getUnfinalizedExchanges(): Promise<any[]> {
    try {
      const unfinalizedExchanges = await this.exchangeService.findUnfinalizedExchanges();
      return unfinalizedExchanges;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  // GET /exchange/:id
  @Get(":id")
  async findById(@Param("id") id: number): Promise<any | null> {
    try {
      const exchange = await this.exchangeService.findExchangeById(id);
      if (!exchange) {
        throw new NotFoundException("Exchange not found");
      }
      return exchange;
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }

  // POST /exchange/:id/match
  @Post(":id/match")
  async createMatch(
    @Request() req:any,
    @Param("id") id: number,
    @Body() matchData: CreateMatchDto
  ): Promise<any> {
    const user = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    try {
      return await this.exchangeService.createMatch(id, matchData);
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }

  // PUT /exchange/match/:id
  @Put('match/:id')
  async updateMatch(@Param('id') exchangeId: number, @Body() matchData: UpdateMatchDto): Promise<any> {
    try {
      const updatedExchange = await this.exchangeService.updateMatch(exchangeId, matchData);
      return updatedExchange;
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }

  // PUT /exchange/match/:id
  @Post('match/predict/:id')
  async predictMatch(@Request() req:any,@Param('id') exchangeId: number, @Body() matchData: any): Promise<any> {
    const user=req.user
    const userId = user.number

      // Check if the user is locked
      if (userLockFlags.get(userId)) {
        throw new NotAcceptableException('Please Wait');
      }

    try {
      userLockFlags.set(userId, true);
      const updatedExchange = await this.exchangeService.predictMatch(exchangeId,user, matchData);
      return updatedExchange;
    } catch (error:any) {
      throw new NotAcceptableException(error);
    } finally {
      // Always set the user's lock flag (rate limit) to false in the finally block
      userLockFlags.set(userId, false);
    }
  }
}
