import {
  Injectable,
  NestMiddleware,
  NotAcceptableException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { MiddlewareOptions, Model } from "mongoose";
import { env } from "process";
require("dotenv").config();
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import {
  SignupDto,
  SetPasswordDto,
  returnSignInDto,
  returnSignUpDto,
  returnSubmitOtpDto,
  returnSetPasswordDto,
} from "./dto/signin.dto";
import { SigninDto, SubmitOtpDto } from "./dto/signin.dto";
import { Client } from "whatsapp-web.js";
import { NextFunction } from "express";

const axios = require("axios");
const util = require("util");

@Injectable()
export class AuthService {
  private client: Client;
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  /**
   *
   * @param signupDto
   * @returns
   */
  async signup(signupDto: SignupDto): Promise<returnSignUpDto> {
    const { username, number, referredBy } = signupDto;
    if (referredBy != undefined) {
      const users = await this.userModel.findOne({ number: referredBy });
      if (!users) {
        throw new NotAcceptableException(`Reffered user is not found`);
      }
    }

    const hashedPassword = await bcrypt.hash("10", 10);
    const wallet = 0;
    const txnHistory = [];
    let referralCode;

    referralCode = `${env.api_url}/sign-up/?ref=${number}`;

    try {
      var user = await this.userModel.create({
        username,
        number,
        password: hashedPassword,
        wallet,
        reward: 0,
        txnHistory,
        isAdmin: false,
        block: false,
        referralCode, // Assign the referralCode here
        referredBy: +referredBy || "", // Assign referredBy or an empty string if not provided
      });
    } catch (err) {
      if (err.code == 11000) {
        let data = Object.keys(err.keyValue);
        throw new NotAcceptableException(`${data} already taken`);
      }
      return err;
    }

    const min = 1000; // Minimum 4-digit number
    const max = 9999; // Maximum 4-digit number

    const otp = Math.floor(Math.random() * (max - min + 1) + min);

    user.otp = otp;
    user.verified = 0;
    await user.save();
    const postData = {
      // Data to be sent in the request body
      number: number,
      message: `🚀 Time to Win Big! 🚀\n\n🔑 Your One-Time Password (OTP) is in your hands - otp: ${otp}! Only valid for 45 seconds ⏳🏆\n\n💰 Enjoy your surprise signup bonus!\n\nBest regards, The Playinsport Team
      `,
    };
    return await this.sendOtp(postData, user);
  }

  /**
   *
   * @param postData
   * @param user
   * @returns
   */
  async sendOtp(postData: any, user: any): Promise<returnSignUpDto> {
    let data: any;
    var _users = user.number;
    if (user.verified == 0) {
      setTimeout(async () => {
        const user = await this.userModel.findOne({ number: _users });
        if (user) {
          if (user.verified == 0) {
            await this.userModel.findOneAndDelete({ number: _users });
            return;
          }

          const new_postData = {
            // Data to be sent in the request body
            number: user.number,
            message: `👋 Hello [${user.username}],\n\n🎉 Welcome to Playinsport.com!\n\n💰 Get ready to score big with a registration bonus up to Rs-5000!\n\n🌟 Use code: NEWPIS\n\n👉 Claim Your Reward- playinsport.com/user/reward\n\nBest regards,\n\nThe Playinsport Team
          `,
          };
          const _response = await this.sendMessage(new_postData).then(
            async (res: any) => {
              data = res;
            }
          );
          if (user.referredBy != "") {
            try {
              user.referredAddresses.push(+user.referredBy);
              user.save();

              const timestamp = new Date().getTime();
              const refAddress = await this.userModel.findOne({
                number: user.referredBy,
              });
              refAddress.reward += 10;
              let txnHistory: any = {
                message: `Referal reward ${user.username}`,
                amount: 10,
                time: timestamp,
                // newBalance: refAddress.wallet
              };
              refAddress.txnHistory.push(txnHistory);
              await refAddress.save();

              const _postData = {
                // Data to be sent in the request body
                number: +user.referredBy,
                message: `🎉 Exciting news! You've brought ${user.username} friends to our awesome community! 🌟\n\n💰 Get ready for your Rs. 10 cash bonus - no code needed.\n\nJust log in at Playinsport.com/user/wallet and let the fun begin! 🏆\n\nBest regards, The Playinsport Team
            `,
              };

              const response = await this.sendMessage(_postData).then(
                (res: any) => {
                  data = res;
                }
              );
            } catch (err) {
              throw new NotAcceptableException("Something went wrong");
            }
          }
        }
      }, 45000);
    }

    try {
      let data: any;
      const response = await this.sendMessage(postData).then((res: any) => {
        data = res;
      });

      var responseData = {
        statusCode: data.status,
        data: data.config.data,
        message: "Otp sent ",
      };
      return responseData;
    } catch (err) {
      // await this.userModel.findOneAndDelete({ number: users });
      throw new NotAcceptableException(`Something went wrong, Contact admin`);
    }
  }

  /**
   *
   * @param singinDto
   * @returns
   */
  async login(singinDto: SigninDto): Promise<returnSignInDto> {
    const { number, password } = singinDto;

    const user = await this.userModel.findOne({ number: number });
    if (!user) {
      throw new UnauthorizedException("number is not valid");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException("Password is not valid");
    }
    const token = this.jwtService.sign({ id: user._id });
    user.token = token;
    await user.save();
    let userDetails = {
      name: user.username,
      number: user.number,
      wallet: user.wallet,
      isAdmin: user.isAdmin,
    };
    const responseData = {
      statusCode: 201,
      token: token,
      data: userDetails,
      message: "Logged in",
    };
    return responseData;
  }

  /**
   *
   * @param submitOtpDto
   * @returns
   */
  async submitOtp(submitOtpDto: SubmitOtpDto): Promise<returnSubmitOtpDto> {
    const { number, otp } = submitOtpDto;
    const user = await this.userModel.findOne({ number: number });
    if (!user) {
      throw new UnauthorizedException("User details not found");
    }
    const isOTPmatched = otp == user.otp;
    if (user.otp == null) {
      throw new UnauthorizedException("OTP is not valid");
    }
    if (!isOTPmatched) {
      throw new UnauthorizedException("OTP is not valid");
    }

    const token = this.jwtService.sign({ id: user._id });
    user.token = token;
    user.verified = 1;
    user.otp = null;
    await user.save();
    let userDetails = {
      name: user.username,
      number: user.number,
      wallet: user.wallet,
    };
    const responseData = {
      statusCode: 201,
      token: token,
      data: userDetails,
      message: "Otp verified",
    };
    return responseData;
  }

  /**
   *
   * @param setPasswordDto
   * @param auth
   * @returns
   */
  async setPassword(
    setPasswordDto: SetPasswordDto
  ): Promise<returnSetPasswordDto> {
    const { token, password } = setPasswordDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.findOne({ token: token });

    if (!user) {
      throw new UnauthorizedException("number is not valid");
    }
    user.password = hashedPassword;
    await user.save();

    return {
      statusCode: 201,
      message: "Password Verified",
    };
  }
  /**
   *
   * @param number
   * @param auth
   * @returns
   */

  async sendOTP(data: any): Promise<returnSignUpDto> {
    let { number } = data;
    let user: any = await this.userModel.findOne({ number: number });

    if (!user) {
      throw new NotAcceptableException(`User not found, sign-up first`);
    }
    const min = 1000;
    const max = 9999;

    const otp = Math.floor(Math.random() * (max - min + 1) + min);

    const postData = {
      number: number,
      message: `🔒 Locked out? Fear not! Your key is here! 🔑\n\n🔥 Reset your password with otp: ${otp}.\n\n⏳ But remember, it's hotter than a sprint, only 45 seconds to use it! 🏃\n\n🌐 Best regards, www.playinsport.com 🌐`,
    };
    if (user.otp != null) {
      throw new NotAcceptableException("Please wait 45 seconds and try again");
    }
    user.otp = otp;
    await user.save();
    setTimeout(async () => {
      user.otp = null;
      await user.save();
    }, 45000);
    return await this.sendOtp(postData, user);
  }

  async adminValidate(data: any): Promise<any> {
    const admin = await this.userModel.findOne({ token: data });
    if (admin) {
      if (!admin.isAdmin) {
        throw new UnauthorizedException(
          "Login as admin to access this endpoint."
        );
      }
    } else {
      throw new UnauthorizedException("User not found");
    }
    return true;
  }

  async validateUser(data: any): Promise<any> {
    let { token } = data;
    const user = await this.userModel.findOne({ token: token });
    if (user) {
      // if (user.isAdmin) {
      //   return {
      //     data: {
      //       isAdmin: true
      //     },
      //     statusCode: 201,
      //     message: "User is an Admin",
      //   };
      // } else {
      //   return {
      //     data: {
      //       isAdmin: false
      //     },
      //     statusCode: 201,
      //     message: "User is not an Admin",
      //   };
      // }
      return true;
    } else {
      throw new UnauthorizedException("You are not an valid user");
    }
  }

  async getQr(): Promise<any> {
    let data: any;
    const response = await axios.get(`${env.qr_url}/qr`).then((res: any) => {
      data = res;
    });
    let _data = {
      data: data.data,
    };
    return _data;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const { token }: any = req.body;

    try {
      const admin = await this.userModel.findOne({ token });

      if (!admin) {
        throw new UnauthorizedException("User not found");
      }

      if (!admin.isAdmin) {
        throw new UnauthorizedException(
          "Login as admin to access this endpoint."
        );
      }

      // If admin and isAdmin, continue to the next middleware/controller
      next();
    } catch (error) {
      throw new UnauthorizedException("Invalid credentials");
    }
  }

  async sendMessage(postData: any): Promise<any> {
    let data: any;
    try {
      const response = await axios
        .post(`${env.qr_url}/send-otp`, postData)
        .then((res: any) => {
          data = res;
        });
      return data;
    } catch {
      console.log("message error-whatsapp");
    }
  }

  async sendGroupMessage(postData: any): Promise<any> {
    let data: any;
    try {
      const response = await axios
        .post(`${env.qr_url}/send-otp`, postData)
        .then((res: any) => {
          data = res;
        });
      return data;
    } catch {
      console.log("message error-whatsapp");
    }
  }

  async validateJwtUser(payload: any) {
    const token = payload.sub;
    const user = await this.userModel.findOne({ token:token } ); // Use findOne with 'where'

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    return user;
  }
}

// @Injectable()
// export class AdminMiddleware implements NestMiddleware {
//   constructor(@InjectModel("User") private userModel: Model<User>) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     const { token }: any = req.body;

//     try {
//       const admin = await this.userModel.findOne({ token });

//       if (!admin) {
//         throw new UnauthorizedException("User not found");
//       }

//       if (!admin.isAdmin) {
//         throw new UnauthorizedException(
//           "Login as admin to access this endpoint."
//         );
//       }

//       // If admin and isAdmin, continue to the next middleware/controller
//       next();
//     } catch (error) {
//       throw new UnauthorizedException("Invalid credentials");
//     }
//   }
// }
