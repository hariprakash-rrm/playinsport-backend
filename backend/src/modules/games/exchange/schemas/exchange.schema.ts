import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: true,
})
export class Exchange {
  @Prop({ unique: true })
  id: number;

  @Prop()
  name: string;

  @Prop()
  gameType:number

  @Prop()
  isFinalized: boolean;

  @Prop({ type: Object })
  match: {
    team1: string;

    team2: string;

    odds1: number;

    odds2: number;

    startTime: number;

    endTime: number;

    details: object[];

    isFinalized: boolean;

    message: string;
  };

  @Prop({ type: Object })
  toss: {
    team1: string;

    team2: string;

    odds1: number;

    odds2: number;

    startTime: number;

    endTime: number;

    details: [];

    isFinalized: boolean;

    message: string;
  };

  @Prop()
  lambi: [
    {
      team: string;

      over: string;

      yes: number;

      no: number;

      startTime: number;

      endTime: number;

      details: [];

      isFinalized: boolean;

      message: string;
    }
  ];
 
}

export const ExchangeSchema = SchemaFactory.createForClass(Exchange);
