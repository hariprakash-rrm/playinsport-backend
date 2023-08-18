import { IsNotEmpty,IsNumber, IsString, Length, MinLength, isNotEmpty, isString } from "class-validator";


export class SignupDto{

    @IsNotEmpty()
    @IsNumber()
    readonly name: number;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly username:string

    @IsNotEmpty()
    @IsString()
    readonly number:string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password:string

}