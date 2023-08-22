import { IsNotEmpty } from "class-validator"


export class couponDto {

    @IsNotEmpty()
    readonly token: string
    readonly coupon:string
   

}