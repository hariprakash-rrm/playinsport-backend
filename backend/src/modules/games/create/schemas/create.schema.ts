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
totalToken:number[]

@Prop()
prize:[]

@Prop({unique:true})
selected:number[]

@Prop()
winnerList:[]

@Prop()
maximumTokenPerUser:string


}

export const GameSchema = SchemaFactory.createForClass(Game)