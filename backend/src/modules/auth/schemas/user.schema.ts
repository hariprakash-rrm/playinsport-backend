import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString, Matches } from 'class-validator';

@Schema({
    timestamps:true
})

export class User{
   

    @Prop({unique:true})
    @Matches(/^[^\s]+$/, {
        message: 'Username cannot contain spaces',
      })
    username:string

    @Prop({unique:true})
    number:number

    @Prop()
    password:string

    @Prop()
    wallet:number

    @Prop()
    reward:number

    @Prop()
    txnHistory :object[]

    @Prop()
    token:string

    @Prop()
    otp:number

    @Prop()
    verified:number

    @Prop()
    isAdmin:boolean

    @Prop()
    block:boolean=false

    @Prop()
    referralCode: string

    @Prop()
    referredBy: string | null

    @Prop()
    referredAddresses: number[]
}
export const UserSchema = SchemaFactory.createForClass(User)
