import {
  Get,
  HttpException,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
  HttpServer,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";

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
import { Client, Message } from "whatsapp-web.js";
import { env } from "process";

const axios = require("axios");
const http = require("http");

@Injectable()
export class AuthService {
  private client: Client;
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
  ) { }

  /**
   *
   * @param signupDto
   * @returns
   */
  async signup(signupDto: SignupDto): Promise<returnSignUpDto> {
    const { username, number } = signupDto;

    const hashedPassword = await bcrypt.hash("10", 10);
    const wallet = 0;
    try {
      var user = await this.userModel.create({
        username,
        number,
        password: hashedPassword,
        wallet,
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
    user.save();
    const postData = {
      // Data to be sent in the request body
      number: number,
      message: `Otp only valid for 15sec : ${otp}`,
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
    var users = user.number;
    try {
      const response = await axios
        .post("http://localhost:3001/send-otp", postData)
        .then((res: any) => {
          // console.log(res)
          data = res;
        });
      console.log(data);
      const responseData = {
        statusCode: data.status,
        data: data.config.data,
        message: "Otp sent ",
      };
      setTimeout(async () => {
        const user = await this.userModel.findOne({ number: users });
        if (user.verified == 0) {
          await this.userModel.findOneAndDelete({ number: users });
        }
      }, 15000);

      return responseData;
    } catch (err) {
      await this.userModel.findOneAndDelete({ users });
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
    user.save();
    let userDetails = {
      name: user.username,
      number: user.number,
      wallet: user.wallet,
    };
    const responseData = {
      statusCode: 201,
      token: token,
      details: userDetails,
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
    user.save();
    let userDetails = {
      name: user.username,
      number: user.number,
      wallet: user.wallet,
    };
    const responseData = {
      statusCode: 201,
      token: token,
      details: userDetails,
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
    console.log(token)
    const user = await this.userModel.findOne({ token: token });

    if (!user) {
      throw new UnauthorizedException("number is not valid");
    }
    user.password = hashedPassword;
    user.save();

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

  async sendOTP(number: number): Promise<returnSignUpDto> {
    let { num }: any = number
    let user: any = await this.userModel.findOne({ number: num });
    //  console.log(user)
    if (!user) {
      throw new NotAcceptableException(`User not found, sign-up first`);
    }
    const min = 1000; // Minimum 4-digit number
    const max = 9999; // Maximum 4-digit number

    const otp = Math.floor(Math.random() * (max - min + 1) + min);

    user.otp = otp;
    await user.save();
    const postData = {
      number: number,
      message: `Otp only valid for 45sec : ${otp}`,
    };
    setTimeout(async () => {
      user.otp = null;
      user.save();
    }, 45000);
    return await this.sendOtp(postData, user);
  }
}
