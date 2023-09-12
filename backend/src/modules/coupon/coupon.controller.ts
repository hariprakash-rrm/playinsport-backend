import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
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
@UseGuards(AuthGuard())
export class CouponController {
  constructor(
    private authService: AuthService,
    private couponService: CouponService
  ) {}

  @Post("/claim")
  async claimCoupon(@Body() data: couponDto): Promise<any> {
    return await this.couponService.claimCoupon(data);
  }

  @Post("/create")
  async createCoupon(
    @Request() req: any,
    @Body() data: CreateCouponDto
  ): Promise<any> {
    const user = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    return await this.couponService.createCoupon(data);
  }

  @Post("/isActive")
  async isActiveCoupon(
    @Request() req: any,
    data: isActiveCouponDto
  ): Promise<any> {
    const user = req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException("You are not an admin");
    }
    return await this.couponService.createCoupon(data);
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
