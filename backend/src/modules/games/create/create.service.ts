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
        var tokenDetails:any[]=[]

        for(let i=1;i<=totalTokenNumber;i++){
            let data ={
                tokenNumber:i,
                selectedBy:'',
                isSelected:false
            }
            tokenDetails.push(data)
        }
        try {
            let count = await this.gameModel.countDocuments().exec();
            var game = await this.gameModel.create({
                round: count+1, name,date, prize,tokenPrice,maximumTokenPerUser,tokenDetails
            })
             

        } catch (err) {
            console.log(err)
        }

        return game
    }
}
