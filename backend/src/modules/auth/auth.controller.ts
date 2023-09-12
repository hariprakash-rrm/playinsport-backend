import { Body, Controller, Get, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SetPasswordDto,
  SignupDto,
  returnSignInDto,
  returnSignUpDto,
  returnSubmitOtpDto,
  sendotpDto,
  returnOtp,
} from "./dto/signin.dto";
import { SigninDto } from './dto/signin.dto';
import { SubmitOtpDto } from './dto/signin.dto';
import { Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminMiddleware } from '../shared/admin-auth/admin.guard';

@Controller("")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  signUp(@Body() signupdto: SignupDto): Promise<returnSignUpDto> {
    return this.authService.signup(signupdto);
  }


  @Post("/signin")
  @UseGuards(AdminMiddleware)
  signin(@Body() signinDto: SigninDto): Promise<returnSignInDto> {
    return this.authService.login(signinDto);
  }

  @Post("/submit-otp")
  submitOtp(@Body() submitOtp: SubmitOtpDto): Promise<returnSubmitOtpDto> {
    return this.authService.submitOtp(submitOtp);
  }

  @Post("/set-password")
  @UseGuards(AuthGuard())
  setPassword(@Body() setPassword: SetPasswordDto) {
    return this.authService.setPassword(setPassword);
  }

  @Post("/send-otp")
  sendOtp(@Body() number: number): Promise<returnSignUpDto> {
    console.log(number);
    return this.authService.sendOTP(number);
  }

  @Post('/qr')
  async getQr(@Body()accessToken:any):Promise<any>{
    console.log(accessToken,'data')
    let {token}=accessToken
        let isAdmin = await this.authService.adminValidate(token)
        if (isAdmin) {
          return this.authService.getQr()
        }
        else {
            throw new UnauthorizedException(' You are not an admin')
        }
    
  }
}
