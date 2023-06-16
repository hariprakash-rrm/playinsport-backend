import { AuthService } from './auth.service';
import { SetPasswordDto, SignupDto, returnSignInDto, returnSignUpDto, returnSubmitOtpDto, sendOTPForResetPasswordDto } from './dto/signin.dto';
import { SigninDto } from './dto/signin.dto';
import { SubmitOtpDto } from './dto/signin.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(signupdto: SignupDto): Promise<returnSignUpDto>;
    signin(signinDto: SigninDto): Promise<returnSignInDto>;
    submitOtp(submitOtp: SubmitOtpDto): Promise<returnSubmitOtpDto>;
    setPassword(setPassword: SetPasswordDto, authToken: string): Promise<import("./dto/signin.dto").returnSetPasswordDto>;
    sendOTPForResetPassword(number: sendOTPForResetPasswordDto): Promise<returnSubmitOtpDto>;
}
