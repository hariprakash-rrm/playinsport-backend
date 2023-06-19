import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './schemas/create.schema';
import mongoose, { Model } from 'mongoose';
@Injectable()
export class CreateService {
    constructor(@InjectModel(Game.name)
    private gameModel: Model<Game>) { }


    async create(data: any): Promise<any> {
        let { name, prize, tokenPrice, date, maximumTokenPerUser ,totalTokenNumber} = data
        console.log(name, prize, tokenPrice, date, maximumTokenPerUser,totalTokenNumber)
        console.log(totalTokenNumber);
        var totalToken:any[]=[]
        for(let i=0;i<totalTokenNumber;i++){
            totalToken.push(i+1)
        }
        try {
            let count = await this.gameModel.countDocuments().exec();
            var game = await this.gameModel.create({
                round: count+1, name,date, prize,tokenPrice,maximumTokenPerUser,totalToken
            })
             

        } catch (err) {
            console.log(err)
        }

        return game
    }
}
