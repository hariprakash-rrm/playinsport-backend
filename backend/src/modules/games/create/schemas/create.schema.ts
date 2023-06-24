import { Prop,Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({
    timestamps:true
})

export class Game{

@Prop({unique:true})
round:string

@Prop()
name:string

@Prop()
tokenPrice:string

@Prop()
totalToken:object[]

@Prop()
tokenDetails:object[]

@Prop()
prize:[]

@Prop()
winnerList:[]

@Prop()
maximumTokenPerUser:string

@Prop({ type: Date, required: true })
date: Date


}

export const GameSchema = SchemaFactory.createForClass(Game)