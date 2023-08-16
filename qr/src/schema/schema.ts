import { Prop, SchemaFactory } from "@nestjs/mongoose";

export class QrCode{
    @Prop()
    qrCode:string
}

export const Qr = SchemaFactory.createForClass(QrCode)