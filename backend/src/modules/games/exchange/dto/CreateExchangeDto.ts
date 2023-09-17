import { IsString, IsNumber, IsNotEmpty, IsEnum } from 'class-validator';
export enum ExchangeType {
  Cricket = 'Cricket',
  Tennis = 'Tennis',
}
export class CreateExchangeDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(ExchangeType, { message: 'Invalid exchange type. Must be Cricket or Tennis.' })
  types: ExchangeType;

  @IsString()
  @IsNotEmpty()
  mode: string;

  @IsString()
  @IsNotEmpty()
  team1: string;

  @IsString()
  @IsNotEmpty()
  team2: string;

  @IsNumber()
  @IsNotEmpty()
  odds1: number;

  @IsNumber()
  @IsNotEmpty()
  odds2: number;

  @IsNumber()
  @IsNotEmpty()
  startTime: number;

  @IsNumber()
  @IsNotEmpty()
  endTime: number;
}
