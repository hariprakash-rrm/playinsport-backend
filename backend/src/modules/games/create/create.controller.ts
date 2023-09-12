import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { createTokenDto, RefundDto } from "./dto/createToken.dto";
import { CreateService } from "./create.service";

import { AuthGuard } from "@nestjs/passport";

@Controller("token")
@UseGuards(AuthGuard())
export class CreateController {
  constructor(private createService: CreateService) {}

  @Post("/create")
  async create(
    @Request() req: any,
    @Body() data: createTokenDto
  ): Promise<any> {
    const user = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    return this.createService.create(data);
  }

  @Post("/refund")
  async refund(@Request() req: any, @Body() data: RefundDto): Promise<any> {
    const user = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    return this.createService.refund(data);
  }

  @Post("/update")
  async update(@Request() req: any, @Body() data: any) {
    const user = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    return this.createService.update(data);
  }

  @Post("/update-reward-type")
  async updateRewardType(@Request() req: any, @Body() data: any) {
    const user = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    return this.createService.updateRewardType(data);
  }

  @Get("/get")
  async get(@Query() round: any): Promise<any> {
    return this.createService.get(round);
  }

  @Get("/games")
  async getGame(@Query() dates: any): Promise<any> {
    return this.createService.getGames(dates);
  }
}
