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
    image:string

    @Prop()
    tokenPrice: number

    @Prop()
    totalToken: object[]

    @Prop()
    tokenDetails: object[]

    @Prop()
    prize: []

    @Prop()
    winnerList: number[]

    @Prop()
    maximumTokenPerUser: number

    @Prop({ type: Date, required: true })
    date: Date

    @Prop()
    isComplete: boolean

    @Prop()
    status: string

    @Prop()
    youtubeLink: string

    @Prop()
    facebookLink: string

    @Prop()
    facebookLiveLink: string

    @Prop()
    youtubeLiveLink: string

    @Prop({
        enum: ['cash', 'other'],
    })
    rewardType: string;

}

export const GameSchema = SchemaFactory.createForClass(Game)

export class GameDetails {

    @Prop({ unique: true })
    round: number

    @Prop()
    details: [{
        name: String
        prize: [],
        tokenPrice: number,
        maximumTokenPerUser: number,
        totalTokenNumber: number,
        date: number,
        token: string,
        youtubeLink: string,
        youtubeLiveLink: string,
        facebookLink: string,
        facebookLiveLink: string,
        winnerList: []
    }]
}

export const GameDetailsScehema = SchemaFactory.createForClass(GameDetails)