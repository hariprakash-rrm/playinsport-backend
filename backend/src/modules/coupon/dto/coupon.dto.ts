import { IsNotEmpty } from "class-validator"


export class couponDto {

    @IsNotEmpty()
    readonly token: string
    readonly coupon:string
   

}

export class CreateCouponDto {

    @IsNotEmpty()
    readonly token: string
    readonly coupon:string
    readonly value:number
    readonly validFor:number[]
    readonly validFrom:number
    readonly validUpto:number

}

export class isActiveCouponDto {

    @IsNotEmpty()
    readonly token: string
    readonly coupon:string
    readonly change:boolean

}
export class detailsCouponDto {

    @IsNotEmpty()
    readonly coupon:string
    

}