import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {  AuthService } from "../auth/auth.service";
import { CouponService } from "./coupon.service";
import {
  CreateCouponDto,
  couponDto,
  detailsCouponDto,
  isActiveCouponDto,
} from "./dto/coupon.dto";
import { promises } from "fs";
import { AuthGuard } from "@nestjs/passport";

@Controller("coupon")
export class CouponController {
  constructor(
    private authService: AuthService,
    private couponService: CouponService
  ) {}

  @Post("/claim")
  @UseGuards(AuthGuard())
  async claimCoupon(@Body() data: couponDto): Promise<any> {
    let isUser = await this.authService.validateUser(data);
    if (isUser) {
      return await this.couponService.claimCoupon(data);
    } else {
      throw new UnauthorizedException(" You are not a valid user");
    }
  }

  @Post("/create")
  // @UseGuards(AdminMiddleware)
  async createCoupon(@Body() data: CreateCouponDto): Promise<any> {
    let { token } = data;
    let isAdmin = await this.authService.adminValidate(token);
    if (isAdmin) {
      return await this.couponService.createCoupon(data);
    }
    throw new UnauthorizedException(" You are not a valid user");
  }

  @Post("/isActive")
  async isActiveCoupon(data: isActiveCouponDto): Promise<any> {
    let { token } = data;
    let isAdmin = await this.authService.adminValidate(token);
    if (isAdmin) {
      return await this.couponService.createCoupon(data);
    }
    throw new UnauthorizedException(" You are not a valid user");
  }

  @Get("/detials")
  async couponDetails(data: detailsCouponDto): Promise<any> {
    return await this.couponService.details(data);
  }

  @Get("/get-coupons")
  async getCoupons(): Promise<any> {
    return this.couponService.getLast50Coupons();
  }
}
