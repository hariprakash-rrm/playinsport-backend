import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({
    timestamps:true
})

export class User{
   

    @Prop({unique:true})
    username:string

    @Prop({unique:true})
    number:number

    @Prop()
    password:string

    @Prop()
    wallet:number

    @Prop()
    token:string

    @Prop()
    otp:number

    @Prop()
    verified:number
}
export const UserSchema = SchemaFactory.createForClass(User)