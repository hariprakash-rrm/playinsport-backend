import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

@Controller('')
export class AuthController {
    constructor(private authService: AuthService) { }


    @Post('/signup')
    signUp(@Body() signupdto: SignupDto): Promise<{ token: string }> {
        return this.authService.signup(signupdto)
    }

    @Post('/signin')
    signin(@Body() signinDto: SigninDto): Promise<{ token: string }> {
        return this.authService.login(signinDto)
    }
}
