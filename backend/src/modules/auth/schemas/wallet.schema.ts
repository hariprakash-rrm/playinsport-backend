import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Date } from "mongoose";

@Schema({
    timestamps: true
})

export class DepositWallet {


    @Prop({ unique: true })
    transactionId: string

    @Prop()
    amount: number

    @Prop()
    mobileNumber: number

    @Prop()
    userPhoneNumber: number

    @Prop({
        enum: ['pending', 'deposited', 'declined'],
        default: 'pending',
    })
    status: string = 'pending';

    @Prop()
    paymentMethod: string

    @Prop()
    method:string

    @Prop()
    message: string

}

@Schema({
    timestamps: true
})

export class WithdrawWallet {

    @Prop()
    amount: number

    @Prop()
    userPhoneNumber: number

    @Prop({
        enum: ['pending', 'deposited', 'declined','withdrawn'],
        default: 'pending',
    })
    status: string = 'pending';

    @Prop()
    method:string

    @Prop()
    message: string

}
export const DepositWalletSchema = SchemaFactory.createForClass(DepositWallet)
export const WithdrawWalletSchema = SchemaFactory.createForClass(WithdrawWallet)
