import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignupDto, SetPasswordDto, returnSignInDto, returnSignUpDto, returnSubmitOtpDto, returnSetPasswordDto, sendOTPForResetPasswordDto } from './dto/signin.dto';
import { SigninDto, SubmitOtpDto } from './dto/signin.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    private client;
    constructor(userModel: Model<User>, jwtService: JwtService);
    signup(signupDto: SignupDto): Promise<returnSignUpDto>;
    sendOtp(postData: any, user: any): Promise<any>;
    login(singinDto: SigninDto): Promise<returnSignInDto>;
    submitOtp(submitOtpDto: SubmitOtpDto): Promise<returnSubmitOtpDto>;
    setPassword(setPasswordDto: SetPasswordDto, auth: any): Promise<returnSetPasswordDto>;
    sendOTPForResetPassword(SendOTPForResetPasswordDto: sendOTPForResetPasswordDto): Promise<any>;
}
