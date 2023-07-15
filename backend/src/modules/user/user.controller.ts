import { Controller } from '@nestjs/common';
import { Body, Query, Get, Injectable, Post, UnauthorizedException } from '@nestjs/common';
import { GetUserDto, UpdateUserDto, UserWalletDto, GetUserDetailsDto } from '../games/create/dto/createToken.dto';

import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
@Controller("user")
export class UserController {
  constructor(
    private userService: UserService,
    private adminValidate: AuthService
  ) { }

  @Get("/all-user")
  async getAllUser(@Body() data: any): Promise<any> {
    let { token } = data;
    let isAdmin = await this.adminValidate.adminValidate(token);
    if (isAdmin) {
      return this.userService.getAllUser();
    } else {
      throw new UnauthorizedException(" You are not an admin");
    }
  }

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

}
