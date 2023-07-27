import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Date } from "mongoose";

@Schema({
    timestamps: true
})

export class DepositWallet {


    @Prop()
    DepositTransactionId: number


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
    withdrawTransactionId: number

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


@Schema({
    timestamps: true
})
export class TotalSupply{

    @Prop()
    totalDeposit:number

    @Prop()
    totalWithdraw:number
}

export const DepositWalletSchema = SchemaFactory.createForClass(DepositWallet)
export const WithdrawWalletSchema = SchemaFactory.createForClass(WithdrawWallet)
export const TotalSupplySchema = SchemaFactory.createForClass(TotalSupply)
