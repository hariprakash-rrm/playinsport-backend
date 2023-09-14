import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: true,
})
export class Exchange {
  @Prop({ unique: true })
  id: number;

  @Prop()
  types: string;

  @Prop()
  mode: string;

  @Prop()
  team1: string;

  @Prop()
  team2: string;

  @Prop()
  odds1: number;

  @Prop()
  odds2: number;

  @Prop()
  startTime: number;

  @Prop()
  endTime: number;

  @Prop()
  details: [];

  @Prop()
  isFinalized: boolean;

  @Prop()
  message: string;
}

export const ExchangeSchema = SchemaFactory.createForClass(Exchange);
