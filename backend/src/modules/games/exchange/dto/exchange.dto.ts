import { IsNotEmpty, IsBoolean, IsString, IsNumber, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class MatchDetailDTO {
    @IsString()
    @IsNotEmpty()
    teamname: string;
  
    @IsNumber()
    @IsNotEmpty()
    teamodds: number;
  
    @IsString()
    @IsNotEmpty()
    username: string;
  
    @IsString()
    @IsNotEmpty()
    usernumber: string;
  
    @IsNumber()
    @IsNotEmpty()
    amount: number;
  }
  
  export class MatchDTO {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    team1: string;
  
    @IsString()
    @IsNotEmpty()
    team2: string;
  
    @IsString()
    @IsNotEmpty()
    type: string;
  
    @IsNumber()
    @IsNotEmpty()
    team1odds: number;
  
    @IsNumber()
    @IsNotEmpty()
    team2odds: number;
  
    @IsBoolean()
    @IsNotEmpty()
    isfinalised: boolean;
  
    @IsNumber()
    @IsNotEmpty()
    totalAmount: number;
  
    @IsDate()
    @IsNotEmpty()
    matchDate: Date; // Add matchDate field
  
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => MatchDetailDTO)
    details: MatchDetailDTO[];
  }
  export class MatchOddsDTO {
    @IsNumber()
    @IsNotEmpty()
    team1Odds: number;
  
    @IsNumber()
    @IsNotEmpty()
    team2Odds: number;
  
    @IsString()
    @IsNotEmpty()
    username: string;
  
    @IsString()
    @IsNotEmpty()
    userPhoneNumber: string;
  
    @IsNumber()
    @IsNotEmpty()
    amount: number;
  
    @IsDate()
    @IsNotEmpty()
    matchDate: Date;
  }