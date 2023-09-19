import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateMatchDto {
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
