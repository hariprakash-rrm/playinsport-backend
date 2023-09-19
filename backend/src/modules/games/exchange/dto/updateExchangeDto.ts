import { IsNumber, IsString, IsOptional, IsBoolean, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateMatchDto {
  @IsNumber()
  id: number;

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

  @IsBoolean()
  isFinalized: boolean;

  @IsOptional()
  @IsString()
  message: string;
}
