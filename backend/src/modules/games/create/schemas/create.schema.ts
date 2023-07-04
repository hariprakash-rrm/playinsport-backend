import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({
    timestamps: true
})

export class Game {

    @Prop({ unique: true })
    round: number

    @Prop()
    name: string

    @Prop()
    tokenPrice: number

    @Prop()
    totalToken: object[]

    @Prop()
    tokenDetails: object[]

    @Prop()
    prize: []

    @Prop()
    winnerList: []

    @Prop()
    maximumTokenPerUser: number

    @Prop({ type: Date, required: true })
    date: Date

    @Prop()
    isComplete: boolean

}

export const GameSchema = SchemaFactory.createForClass(Game)

export class GameDetails {

    @Prop({ unique: true })
    round: number

    @Prop()
    details: [{
        name: String
        prize: [],
        tokenPrice: Number,
        maximumTokenPerUser: number,
        totalTokenNumber: number,
        date: number,
        token: string
    }]
}

export const GameDetailsScehema = SchemaFactory.createForClass(GameDetails)