import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true,
})
export class Coupon extends Document {
    @Prop({ unique: true })
    code: string;

    @Prop()
    isActive: boolean;

    @Prop()
    validFor: number[];

    @Prop()
    validFrom: string;

    @Prop()
    validUpto: string;

    @Prop()
    usedBy:number[]

    @Prop()
    canUse:number

    @Prop()
    value: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
