import { IsNotEmpty,IsNumber, IsString, Length, MinLength, isNotEmpty, isString } from "class-validator";


export class SignupDto{

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly username:string

    @IsNotEmpty()
    @IsNumber()
    readonly number:number

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password:string

}