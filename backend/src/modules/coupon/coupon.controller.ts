import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AdminMiddleware, AuthService } from "../auth/auth.service";
import { CouponService } from "./coupon.service";
import { couponDto } from "./dto/coupon.dto";

@Controller("coupon")
export class CouponController {
  constructor(
    private authService: AuthService,
    private couponService: CouponService
  ) {}

  @Post("/claim")
  async claimCoupon(@Body() data: couponDto):Promise <any> {
    let isUser = await this.authService.validateUser(data);
    if (isUser) {
      return await this.couponService.claimCoupon(data);
    } else {
      throw new UnauthorizedException(" You are not a valid user");
    }
  }

  @Post("/create")
  // @UseGuards(AdminMiddleware)
  async createCoupon(@Body() data: any) {
    let { token } = data;
    let isAdmin = await this.authService.adminValidate(token);
    if (isAdmin) {
      return await this.couponService.createCoupon(data)
    }
    throw new UnauthorizedException(" You are not a valid user");
  
  }

  @Post("/delete")
  async deleteCoupon(data: any) {}

  @Post("/isActive")
  async isActiveCoupon(data: any) {}

  @Get("/detials")
  async couponDetails(data: any) {}
}
