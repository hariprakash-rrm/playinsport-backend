import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";



@Schema({
    timestamps: true
})


export class Coupon{

@Prop({unique:true})
code:string

@Prop()
isActive:boolean

@Prop()
validFor:number[] | ''

@Prop()
validFrom:string

@Prop()
validUpto:string

@Prop()
value:number
}

export const CouponSchema = SchemaFactory.createForClass(Coupon)