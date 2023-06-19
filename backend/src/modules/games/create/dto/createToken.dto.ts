import { IsEnum, IsNotEmpty, IsString } from "class-validator";


export class createTokenDto{

    @IsNotEmpty()
    readonly name:string

    
    readonly Prize:[string,string]

    @IsNotEmpty()
    readonly tokenPrice:string

    @IsNotEmpty()
    readonly date:string

    @IsNotEmpty()
    readonly maximumTokenPerUser:string

}



