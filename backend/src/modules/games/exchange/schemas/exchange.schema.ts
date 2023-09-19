import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: true,
})
export class Exchange {
  @Prop({ unique: true })
  id: number;

  @Prop()
  name: string;

  @Prop({ type: Object })
  match: {
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

  @Prop({ type: Object })
  Toss: {
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
  team1: [
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
  isFinalized: boolean;
}

export const ExchangeSchema = SchemaFactory.createForClass(Exchange);
