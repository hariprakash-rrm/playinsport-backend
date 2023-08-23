import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Coupon } from "./schema/couponSchema";
import { Model } from "mongoose";
import { User } from "../auth/schemas/user.schema";

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name)
    private couponModel: Model<Coupon>,
    @InjectModel(User.name)
    private userModal: Model<User>
  ) {}

  async claimCoupon(data: any) {
    let { code, token } = data;
    let user = await this.userModal.findOne({ token });
    let coupon: any = await this.couponModel.findOne({ code });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (coupon) {
      const isUsedByUser = await this.couponModel.findOne({
        usedBy: user.number,
      });

      if (isUsedByUser) {
        throw new NotAcceptableException("User has already used a coupon");
      }

      user.reward += coupon.value;
      coupon.usedBy.push(user.number); // Push the coupon's value to the usedBy array
      await user.save();
      return user;
    } else {
      throw new NotAcceptableException("Coupon not found");
    }
  }

  async createCoupon(data: any): Promise<any> {
    let { code, validFor, validFrom, validUpto, value }: any = data;

    try {
      let coupon = await this.couponModel.create({
        code,
        isActive: true,
        validFor,
        validFrom,
        validUpto,
        usedBy: [], // Initialize an empty array for usedBy
        value,
      });

      let res = {
        data: {
          data: coupon,
        },
        message: "Coupon Created",
      };
      return this.returnData(res); // No need for "await" here, assuming returnData is synchronous
    } catch (err) {
      if (err.code === 11000) {
        let data = Object.keys(err.keyValue);
        throw new NotAcceptableException(`${data} already taken`);
      }
      throw err; // Rethrow the error
    }
  }

  async isActiveCoupon(data: any): Promise<any> {
    const { code, change } = data;

    const coupon = await this.couponModel.findOne({ code });

    if (coupon) {
      coupon.isActive = change;
      await coupon.save();

      const res = {
        data: {
          data: coupon,
        },
        message: "Coupon isActive updated",
      };

      return this.returnData(res); // Assuming returnData is synchronous
    } else {
      throw new NotAcceptableException("No coupon found");
    }
  }

  async details(data: any): Promise<any> {
    let { code } = data;
    let coupon = await this.couponModel.findOne({ code });
    if (coupon) {
      let res = {
        data: {
          data: coupon,
        },
        message: "Coupon isActive updated",
      };
      return await this.returnData(res);
    } else {
      throw new NotAcceptableException("No coupon found");
    }
  }
  async returnData(data: any) {
    let retData = {
      message: data.message,
      data: data.data,
      statusCode: data?.statusCode ?? 201,
    };
    return retData;
  }
}
