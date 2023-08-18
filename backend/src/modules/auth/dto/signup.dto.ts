import { IsNotEmpty, IsString, Length, MinLength, isNotEmpty, isString } from "class-validator";


export class SignupDto{

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly username:string

    @IsNotEmpty()
    @IsString()
    readonly number:number

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password:string

}