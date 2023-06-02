import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(signupdto: SignupDto): Promise<{
        token: string;
    }>;
    signin(signinDto: SigninDto): Promise<{
        token: string;
    }>;
}
