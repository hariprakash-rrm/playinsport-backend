import { IsNumber, IsString, IsArray, IsBoolean, IsNotEmpty, IsEnum } from 'class-validator';
export enum ExchangeType {
    Cricket = 'Cricket',
    Tennis = 'Tennis',
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

  @IsArray()
  @IsNotEmpty()
  details: any[];

  @IsBoolean()
  @IsNotEmpty()
  isFinalized: boolean;

  @IsString()
  @IsNotEmpty()
  message: string;
}
export class UpdateDetailDto {
    @IsString()
    @IsNotEmpty()
    username: string;
  
    @IsString()
    @IsNotEmpty()
    usernumber: string;
  
    @IsNumber()
    @IsNotEmpty()
    amount: number;
  
    @IsNumber()
    @IsNotEmpty()
    timestamp: number;
  
    @IsString()
    @IsNotEmpty()
    team: string;
  }