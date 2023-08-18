import { IsNotEmpty,IsNumber, IsString, Length, Min, MinLength, isNotEmpty, isString } from "class-validator";


export class SigninDto {


    @IsNotEmpty()
    @IsNumber()
    readonly number: number

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string

}

export class SignupDto {

   
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly username: string

    @IsNotEmpty()
    @IsNumber()
    readonly number: number

}

export class sendotpDto {
  @IsNotEmpty()
  @IsNumber()
  readonly number: number;
}

export class SubmitOtpDto {

    @IsNotEmpty()
    @IsNumber()
    readonly number: number
    readonly otp: number

}

export class SetPasswordDto{

    @IsNotEmpty()
    readonly token:string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string

}

export class returnSignInDto{
    statusCode:number
    token:string
    message :string
}

export class returnSignUpDto{
    statusCode:number
    data:any
    message :string
}

export class returnSubmitOtpDto{
    statusCode:number
    token:string
    message :string
}

export class returnSetPasswordDto{
    statusCode:number
    message :string
}

export class returnOtp {
  statusCode: number;
  otp: string;
  message: string;
}