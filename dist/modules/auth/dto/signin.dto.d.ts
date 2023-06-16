export declare class SigninDto {
    readonly number: string;
    readonly password: string;
}
export declare class SignupDto {
    readonly username: string;
    readonly number: string;
}
export declare class SubmitOtpDto {
    readonly number: string;
    readonly otp: number;
}
export declare class SetPasswordDto {
    readonly token: string;
    readonly password: string;
}
export declare class returnSignInDto {
    statusCode: number;
    token: string;
    message: string;
}
export declare class returnSignUpDto {
    statusCode: number;
    data: any;
    message: string;
}
export declare class returnSubmitOtpDto {
    statusCode: number;
    token: string;
    message: string;
}
export declare class returnSetPasswordDto {
    statusCode: number;
    message: string;
}
export declare class sendOTPForResetPasswordDto {
    readonly number: string;
}
export declare class returnSubmitOtpForResetPasswordDto {
    readonly otp: number;
}
