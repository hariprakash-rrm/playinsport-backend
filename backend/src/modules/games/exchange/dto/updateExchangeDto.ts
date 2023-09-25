import { IsString, IsNumber, IsBoolean, IsArray, IsNotEmpty } from 'class-validator';

export class UpdateMatchDto {
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
