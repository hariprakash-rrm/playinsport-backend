import { Controller, NotAcceptableException, Res } from '@nestjs/common';
import { Body, Query, Get, Injectable, Post, UnauthorizedException } from '@nestjs/common';
import { GetUserDto, UpdateUserDto, UserWalletDto, GetUserDetailsDto, walletDto } from '../games/create/dto/createToken.dto';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { ExcelService } from '../shared/excelService';
import { Response } from 'express';

@Controller("user")
export class UserController {
  constructor(
    private userService: UserService,
    private adminValidate: AuthService,
    private excelService: ExcelService
  ) { }

  // @Get("/all-user")
  // async getAllUser(@Body() data: any): Promise<any> {
  //   return this.userService.getAllUser();
  // }


  @Get("/get-user")
  async getUser(@Query() data: GetUserDto): Promise<any> {
    let { token } = data;
    let isAdmin = await this.adminValidate.adminValidate(token);
    if (isAdmin) {
      return this.userService.getUser(data);
    } else {
      throw new UnauthorizedException(" You are not an admin");
    }
  }

  @Post('/update-user')
  async updateUser(@Body() data: UpdateUserDto): Promise<any> {
    console.log(data);
    let { token } = data;
    let isAdmin = await this.adminValidate.adminValidate(token);
    if (isAdmin) {
      return this.userService.updateUser(data);
    } else {
      throw new UnauthorizedException(" You are not an admin");
    }
  }

  @Post("/update-user-wallet")
  async updateUserWallet(@Body() data: UserWalletDto): Promise<any> {
    let { token } = data;
    let isAdmin = await this.adminValidate.adminValidate(token);
    if (isAdmin) {
      return this.userService.updateUserWallet(data);
    } else {
      throw new UnauthorizedException(" You are not an admin");
    }
  }
  /**
   * 
   * @param data acesstoken
   * @returns user details: name, wallet, transaction history, phonenumber, is admin
   */
  @Get("/get-user-details")
  async getUserDetails(@Query() data: GetUserDetailsDto): Promise<any> {

    try {
      console.log(data);
      return this.userService.getUserDetails(data);
    } catch (err) {
      console.log(err);
    }
  }

  @Get('/export')
  async exportUsersToExcel(@Body() data: any, @Res() res: Response): Promise<void> {
    let { token } = data;
    let isAdmin = await this.adminValidate.adminValidate(token);
    if (isAdmin) {
      try {
        return this.userService.exportUsersToExcel(res);
      } catch (err) {
        return err;
      }
    }
    else {
      throw new UnauthorizedException(" You are not an admin");
    }
  }

  @Post('/deposit')
  async walletTransaction(@Body() data: walletDto): Promise<void> {
    
    let isUser = await this.adminValidate.validateUser(data);
    if (isUser) {
      try {
        return this.userService.deposit(data);
      } catch (err) {
        return err;
      }
    } else {
      throw new UnauthorizedException(" You are not a valid user");
    }

  }

  @Get('/getUserWalletTxn')
  async getUserWalletTxn(@Query() data: GetUserDetailsDto):Promise<any>{
    console.log(data,'khjghf')
    let isUser = await this.adminValidate.validateUser(data);
    if (isUser) {
    return await this.userService.getUserWalletTxn(data)
    }
    else {
      throw new UnauthorizedException(" You are not a valid user");
    }

  }
}
