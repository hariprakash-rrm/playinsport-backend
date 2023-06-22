import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SetPasswordDto,
  SignupDto,
  returnSignInDto,
  returnSignUpDto,
  returnSubmitOtpDto,
} from "./dto/signin.dto";
import { SigninDto } from './dto/signin.dto';
import { SubmitOtpDto } from './dto/signin.dto';
import { Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Controller('')
export class AuthController {
    constructor(private authService: AuthService) { }


    @Post('/signup')
    signUp(@Body() signupdto: SignupDto): Promise<returnSignUpDto> {
        return this.authService.signup(signupdto)
    }

    @Post('/signin')
    signin(@Body() signinDto: SigninDto): Promise<returnSignInDto> {
        return this.authService.login(signinDto)
    }

    @Post('/submit-otp')
    submitOtp(@Body() submitOtp:SubmitOtpDto):Promise<returnSubmitOtpDto> {
        return this.authService.submitOtp(submitOtp)
    }

    @Post('/set-password')
    @UseGuards(AuthGuard())
    setPassword(@Body()setPassword:SetPasswordDto){
        return this.authService.setPassword(setPassword)
    }

    @Post('/send-otp')
    sendOtp(@Body() signupdto: SignupDto): Promise<returnSignUpDto> {
        return this.authService.signup(signupdto)
    }
}
