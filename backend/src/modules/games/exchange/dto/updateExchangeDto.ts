import { IsNumber, IsString, IsArray, IsBoolean, IsNotEmpty, IsEnum } from 'class-validator';
export enum ExchangeType {
    Cricket = 'Cricket',
    Tennis = 'Tennis',
  }

  export enum ExchangeMode {
  Toss = 'Toss',
  Match = 'Match',
  Lambi = 'Lambi'
}
  
export class UpdateExchangeDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ExchangeType, { message: 'Invalid exchange type. Must be Cricket or Tennis.' })
  types: ExchangeType;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ExchangeMode, { message: 'Invalid exchange type. Must be Toss or Match or Lmabi.' })
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

  
  @IsBoolean()
  @IsNotEmpty()
  isFinalized: boolean;

  @IsString()
  message: string;
}
export class UpdateDetailDto {
    @IsString()
    @IsNotEmpty()
    username: string;
  
    @IsNumber()
    @IsNotEmpty()
    usernumber: number;
  
    @IsNumber()
    @IsNotEmpty()
    amount: number;
  
    @IsString()
    @IsNotEmpty()
    team: string;
  }