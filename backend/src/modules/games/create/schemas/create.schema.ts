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
date:string

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


}

export const GameSchema = SchemaFactory.createForClass(Game)