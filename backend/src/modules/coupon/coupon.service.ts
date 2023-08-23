import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Coupon } from "./schema/couponSchema";
import { Model } from "mongoose";

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name)
    private couponModel: Model<Coupon>
  ) {}
  async claimCoupon(data: any) {

  }

  async createCoupon(data: any): Promise<any> {
    let { validFor, validFrom, validUpto, value }: any = data;

    let coupon = this.couponModel.create({
        isActive:true,
        validFrom,
        validUpto,
        value
    })
  }
}
