import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
@Controller("")
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post("/signup")
  signUp(@Body() signupdto: SignupDto): Promise<returnSignUpDto> {
    return this.authService.signup(signupdto);
  }

  @Post("/signin")
  signin(@Body() signinDto: SigninDto): Promise<returnSignInDto> {
    return this.authService.login(signinDto);
  }

  @Post("/submit-otp")
  submitOtp(@Body() submitOtp: SubmitOtpDto): Promise<returnSubmitOtpDto> {
    return this.authService.submitOtp(submitOtp);
  }

  @Post("/set-password")
  @UseGuards(AuthGuard())
  setPassword(@Body() setPassword: SetPasswordDto): Promise<any> {
    return this.authService.setPassword(setPassword);
  }

  @Post("/send-otp")
  sendOtp(@Body() number: number): Promise<returnSignUpDto> {
    return this.authService.sendOTP(number);
  }

  @Get("/validate-user")
  validateUser(@Body() token: any): Promise<any> {
    return this.authService.validateUser(token)
  }
}
