import { IsNotEmpty, IsString, Length, MinLength, isNotEmpty, isString } from "class-validator";


export class SigninDto{


    @IsNotEmpty()
    @IsString()
    
    readonly number:string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password:string

}