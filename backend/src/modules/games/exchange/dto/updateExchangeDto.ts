import { IsString, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class UpdateMatchDto {
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

  @IsString()
  message: string;
}
