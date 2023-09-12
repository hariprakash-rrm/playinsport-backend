import { Controller, Request, Res, UseGuards } from "@nestjs/common";
import {
  Body,
  Query,
  Headers,
  Get,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import {
  GetUserDto,
  UpdateUserDto,
  UserWalletDto,
  GetUserDetailsDto,
  walletDto,
  UpdatePaymentDto,
} from "../games/create/dto/createToken.dto";
import { UserService } from "./user.service";
import { Response, query } from "express";
import { AuthGuard } from "@nestjs/passport";

@Controller("user")
@UseGuards(AuthGuard())
export class UserController {
  constructor(private userService: UserService) {}

  // @Get("/all-user")
  // async getAllUser(@Body() data: any): Promise<any> {
  //   return this.userService.getAllUser();
  // }

  @Get("/get-user")
  async getUser(@Request() req: any, @Query() data: GetUserDto): Promise<any> {
    const user = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    return this.userService.getUser(data);
  }

  @Post("/update-user")
  async updateUser(
    @Request() req: any,
    @Body() data: UpdateUserDto
  ): Promise<any> {
    const user = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    return this.userService.updateUser(data);
  }

  @Post("/update-user-wallet")
  async updateUserWallet(
    @Request() req: any,
    @Body() data: UserWalletDto
  ): Promise<any> {
    const user = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    return this.userService.updateUserWallet(data);
  }

  @Get("/get-user-details")
  async getUserDetails(
    @Request() req: any,
    @Query() data: GetUserDetailsDto
  ): Promise<any> {
    try {
      console.log(data);
      return this.userService.getUserDetails(data);
    } catch (err) {
      console.log(err);
    }
  }

  @Get("/export")
  async exportUsersToExcel(
    @Headers() headers: any,
    @Res() res: Response
  ): Promise<void> {
    try {
      return this.userService.exportUsersToExcel(res);
    } catch (err) {
      return err;
    }
  }

  @Post("/deposit")
  async walletTransaction(@Body() data: walletDto): Promise<void> {
    try {
      return this.userService.deposit(data);
    } catch (err) {
      return err;
    }
  }

  @Get("/getUserWalletTxn")
  async getUserWalletTxn(@Query() data: GetUserDetailsDto): Promise<any> {
    return await this.userService.getUserWalletTxn(data);
  }

  @Post("/updatePayment")
  async updatePayment(
    @Request() req: any,
    @Body() data: UpdatePaymentDto
  ): Promise<any> {
    const user = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    return await this.userService.updatePayment(data);
  }

  @Get("/getDepositPayment")
  async getDepositPayment(
    @Request() req: any,
    @Query() data: { method: string; token: string }
  ): Promise<any> {
    const user: any = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    return await this.userService.getDepositPayment(data);
  }
  @Get("/getWithdrawPayment")
  async getWithdrawPayment(
    @Request() req: any,
    @Query() data: { method: string; token: string }
  ): Promise<any> {
    const user = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    return await this.userService.getWithdrawPayment(data);
  }

  // @Get('/getWithdrawTransaction')
  // async getWithdrawTransaction(@Query() data: { transactionId: string; token: string }): Promise<any> {
  //   let { token } = data;
  //   let isAdmin = await this.adminValidate.adminValidate(token);
  //   if (isAdmin) {
  //     return await this.userService.getWithdrawTransaction(data)
  //   }
  //   throw new UnauthorizedException(" You are not a valid user");
  // }

  @Get("/search-transaction")
  async searchTransaction(
    @Request() req: any,
    @Query() data: { method: string; transactionId: number; token: string }
  ): Promise<any> {
    const user = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    return await this.userService.searchTransaction(data);
  }

  @Get("/totalSupply")
  async getTotalSupply(@Request() req: any, @Query() data): Promise<any> {
    const user = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    return await this.userService.getTotalSupply();
  }

  @Get("/transaction-history")
  async getTransactionHistory(@Query() data): Promise<any> {
    return await this.userService.getTransactionHistory(data);
  }

  @Get("/totalSupply")
  async totalSupply(@Request() req: any, @Query() data): Promise<any> {
    const user = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    return await this.userService.getTotalSupply();
  }
}
