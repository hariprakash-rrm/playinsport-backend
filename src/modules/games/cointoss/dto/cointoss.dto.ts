import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CointossCategory } from "../schemas/cointoss.schema";

export class PlayCoinTossDto{

    @IsNotEmpty()
    @IsEnum(CointossCategory,{message:`please enter correct number ${ Object.values(CointossCategory)}`})
    readonly amount:number

    @IsNotEmpty()
    readonly username:string
}



export class PlayCoinTossDtoResult{
    
    @IsNotEmpty()
    username:string

    @IsNotEmpty()
    userWallet:number
    
}