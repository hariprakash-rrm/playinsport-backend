import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './schemas/create.schema';
import mongoose, { Model } from 'mongoose';
@Injectable()
export class CreateService {
    constructor(@InjectModel(Game.name)
    private gameModel: Model<Game>) { }


    async create(data: any): Promise<any> {
        let { name, prize, tokenPrice, date, maximumTokenPerUser } = data
        console.log(name, prize, tokenPrice, date, maximumTokenPerUser)
        
        try {
            let count = await this.gameModel.countDocuments().exec();
            var game = await this.gameModel.create({
                round: count+1, name, prize
            })
             game.totalToken =await [1, 2, 3]
            await game.save()

        } catch (err) {
            console.log(err)
        }

        return game
    }
}
