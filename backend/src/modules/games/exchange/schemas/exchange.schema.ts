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
  match: [
    {
      id: number;

      types: string;

      mode: string;

      team1: string;

      team2: string;

      odds1: number;

      odds2: number;

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
