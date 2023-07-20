import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty, IsString, Matches } from 'class-validator';

@Schema({
    timestamps: true
})

export class Wallet {


    @Prop({ unique: true })
    transactionId: string

    @Prop()
    amount: number

    @Prop()
    mobileNumber: number

    @Prop()
    userPhoneNumber: number

    @Prop({
        enum: ['pending', 'success', 'declined'],
        default: 'pending',
    })
    status: string = 'pending';

    @Prop()
    paymentMethod: string

    @Prop()
    message: string

}
export const WalletSchema = SchemaFactory.createForClass(Wallet)
