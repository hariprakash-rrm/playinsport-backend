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
    const timestamp = new Date().getTime(); // Get the current timestamp
    const { code, token } = data;

    // Find the user by token and the coupon by code
    const user = await this.userModal.findOne({ token });
    const coupon = await this.couponModel.findOne({ code });

    // If user doesn't exist, throw an exception
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // If coupon exists, proceed with validations and claiming
    if (coupon) {
      const isUsedByUser = await this.couponModel.findOne({
        usedBy: user.number,
      });

      // If coupon is already used by the user, throw an exception
      if (isUsedByUser) {
        throw new NotAcceptableException("User has already used a coupon");
      }

      const isValidForUser =
        coupon.validFor.length === 0 || coupon.validFor.includes(user.number);

      // If user is not eligible for the coupon, throw an exception
      if (!isValidForUser) {
        throw new NotAcceptableException(
          "User is not eligible for this coupon"
        );
      }
      const currentTime = new Date().getTime();
      const validFromTimestamp = new Date(coupon.validFrom).getTime();
      const validUptoTimestamp = new Date(coupon.validUpto).getTime();

      // If the current time is outside the coupon's validity range, throw an exception
      if (
        currentTime < validFromTimestamp ||
        currentTime > validUptoTimestamp
      ) {
        throw new NotAcceptableException(
          "Coupon is not valid at the current time"
        );
      }

      if (coupon.usedBy.length >= coupon.canUse) {
        throw new NotAcceptableException(
          "This coupon has already been claimed by the maximum number of users"
        );
      }

      // Update user's reward and coupon's usedBy array
      user.reward += coupon.value;
      coupon.usedBy.push(user.number);

      // Add transaction history for the user
      const txnHistory = {
        message: "Coupon Claimed",
        amount: coupon.value,
        time: timestamp,
        newBalance: user.wallet,
      };

      user.txnHistory.push(txnHistory);
      await user.save();
      await coupon.save();

      return user;
    } else {
      // If coupon doesn't exist, throw an exception
      throw new NotAcceptableException("Coupon not found");
    }
  }

  async createCoupon(data: any): Promise<any> {
    let { code, validFor, validFrom, validUpto, canUse, value }: any = data;

    try {
      let coupon = await this.couponModel.create({
        code,
        isActive: true,
        validFor,
        validFrom,
        validUpto,
        usedBy: [], // Initialize an empty array for usedBy
        canUse,
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

  async getLast50Coupons(): Promise<any> {
    const coupons = await this.couponModel
      .find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest coupons
      .limit(50); // Limit the result to 50 coupons
    let res = {
      data: {
        data: coupons,
      },
      message: "Coupon isActive updated",
    };
    return await this.returnData(res);
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
