import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, ArrayNotEmpty, IsNotEmpty, isNotEmpty } from 'class-validator';

export class CreateExchDto{
  @IsString()
  @IsNotEmpty()
  name:string

  @IsNumber()
  @IsNotEmpty()
  gameTYpe:number
}
export class CreateMatchDto {
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

  @IsOptional()
  @IsString()
  message: string;
}

export class CreateTossDto {
  @IsString()
  team1: string;

  @IsString()
  team2: string;

  @IsNumber()
  odds1: number;

  @IsNumber()
  odds2: number;

  @IsNumber()
  startTime: number;

  @IsNumber()
  endTime: number;

  @IsOptional()
  @IsString()
  message: string;
}