// match.model.ts
import * as mongoose from 'mongoose';

export const MatchSchema = new mongoose.Schema({
    name: String,
    team1: String,
    team2: String,
    type: String,
    team1odds: Number,
    team2odds: Number,
    details: [
     
    ],
    isfinalised: Boolean,
    totalAmount: Number,
    winner: String, // Add the winner field
    matchDate: Date,
  });
  

  export interface Match extends mongoose.Document {
    name: string;
    team1: string;
    team2: string;
    type: string;
    team1odds: number;
    team2odds: number;
    details: {
     
    }[];
    isfinalised: boolean;
    totalAmount: number;
    winner: string; // Add the winner field
    matchDate: Date,
  }
