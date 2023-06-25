import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './schemas/create.schema';
import mongoose, { Model } from 'mongoose';
import { refundDto } from './dto/createToken.dto';
import { User } from 'src/modules/auth/schemas/user.schema';
@Injectable()
export class CreateService {
    constructor(@InjectModel(Game.name)
    private gameModel: Model<Game>,@InjectModel(User.name)
    private userModel: Model<User>) { }


    async create(data: any): Promise<any> {

        let { name, prize, tokenPrice, date, maximumTokenPerUser, totalTokenNumber } = data
        console.log(name, prize, tokenPrice, date, maximumTokenPerUser, totalTokenNumber)
        console.log(totalTokenNumber);
        var tokenDetails: any[] = []
        let count = await this.gameModel.countDocuments().exec();
        for (let i = 0; i < totalTokenNumber; i++) {
            let data = {
                tokenNumber: i + 1,
                selectedBy: '',
                isSelected: false,
                round: count + 1
            }
            tokenDetails.push(data)
        }
        try {
            let count = await this.gameModel.countDocuments().exec();
            var game: any = await this.gameModel.create({
                round: count + 1, name, date, prize, tokenPrice, maximumTokenPerUser, tokenDetails,isComplete:false
            })
            game.tokenDetails.round = game.round
            await game.save()

        } catch (err) {
            console.log(err)
        }

        return game
    }

    async refund(data:refundDto){
        let {round,token}=data
        // let admin:any = await this.userModel.findOne({token:token})
        let game:any = await this.gameModel.findOne({round:round})
        // if(admin.isAdmin){
            if(game){
                const timestamp = new Date().getTime();
                for (let i=0;i<game.tokenDetails.length;i++){
                    if(game.tokenDetails[i].isSelected){
                        let partUser = await this.userModel.findOne({number:game.tokenDetails[i].number})
                        if(partUser){
                            partUser.wallet+= +game.tokenPrice
                            let txnHistory: any = {
                                message: `Round : ${game.round} refund `,
                                amount: game.tokenPrice,
                                time: timestamp
                              }
                            await partUser.txnHistory.push(txnHistory)
                            await partUser.save()
                        }
                    }
                    
                }
            }else{
                throw new NotAcceptableException('game not found')
            }
        // }else{
        //     throw new UnauthorizedException('You are not an admin')
        // }
        
        
    }
}
