import { ConflictException, Injectable, MethodNotAllowedException, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './schemas/create.schema';
import { Model } from 'mongoose';
import { RefundDto } from './dto/createToken.dto';
import { User } from 'src/modules/auth/schemas/user.schema';
import { WithdrawWallet } from 'src/modules/auth/schemas/wallet.schema';
import axios from 'axios';
import { env } from 'process';
require("dotenv").config();
@Injectable()
export class CreateService {
    constructor(@InjectModel(Game.name)
    private gameModel: Model<Game>, @InjectModel(User.name)
        private userModel: Model<User>) { }

    async get(_data: any) {

        let { data }: any = _data
        try {

            let game = await this.gameModel.findOne({ round: +data })
            if (!game) {
                throw new NotAcceptableException('Game not found')
            }
            let res = {
                data: {
                    data: game,
                },
                message: 'Game fetched'
            }

            return await this.returnData(res)
        } catch (err) {
            throw new NotAcceptableException('Game not found')
        }
    }

    async getGames(dates: any) {
        try {
            const dateString = dates.dates
            const _date: any = new Date(dateString);
            let games = await this.gameModel.find({ date: _date });
            let res = {
                data: {
                    data: games,
                },
                message: 'Game retrived'
            }
            if (games.length == 0) {
                throw new NotAcceptableException('game not found in this date')
            }
            return await this.returnData(res)
        } catch (err) {
            throw new NotAcceptableException('game not found in this date')
        }
    }

    async create(data: any): Promise<any> {
        try {
            let { name, prize, tokenPrice, date, maximumTokenPerUser, totalTokenNumber, youtubeLink, facebookLink, youtubeLiveLink, facebookLiveLink } = data
            var tokenDetails: any[] = []
            let count = await this.gameModel.countDocuments().exec();
            for (let i = 0; i < totalTokenNumber; i++) {
                let data = {
                    tokenNumber: i + 1,
                    selectedBy: '',
                    isSelected: false,
                    round: count + 1,
                }
                tokenDetails.push(data)
            }
            try {
                let count = await this.gameModel.countDocuments().exec();
                var game: any = await this.gameModel.create({
                    round: count + 1, name, date, prize, tokenPrice, maximumTokenPerUser, tokenDetails, isComplete: false, status: 'live', youtubeLink, facebookLink, youtubeLiveLink, facebookLiveLink
                })
                game.tokenDetails.round = game.round

                await game.save()
                let res = {
                    data: {
                        data: game,
                    },
                    message: 'Game created'
                }

                return await this.returnData(res)
            } catch (err) {
                throw new NotAcceptableException('Error while creating game')
            }

        } catch (err: any) {
            throw new MethodNotAllowedException('Error while creating game')
        }

    }

    async refund(data: RefundDto) {
        let { round }: any = data

        var game: any = await this.gameModel.findOne({ round: +round })

        if (game) {
            if (game.isComplete) {
                throw new NotAcceptableException('Round already completed')
            }
            try {
                var resData: any[] = []
                const timestamp = new Date().getTime();
                for (let i = 0; i < game.tokenDetails.length; i++) {
                    if (game.tokenDetails[i].isSelected) {
                        let partUser = await this.userModel.findOne({ number: game.tokenDetails[i].number })
                        if (partUser) {

                            partUser.wallet += +game.tokenPrice
                            let txnHistory: any = {
                                message: `Round : ${game.round} Token : ${game.tokenDetails[i].tokenNumber} refund`,
                                amount: game.tokenPrice,
                                time: timestamp,
                                newBalance: partUser.wallet
                            }
                            await partUser.txnHistory.push(txnHistory)
                            await resData.push(partUser.txnHistory)
                            await partUser.save()
                            try{
                                const _postData = {
                                    // Data to be sent in the request body
                                    number: partUser.number,
                                    message: `Round - ${game.round} cancelled - Token -${game.tokenDetails[i].tokenNumber} Rs ${game.tokenPrice} refunded to your wallet \n check here - teamquantum.in/user/transaction-history`,
                                  };
                                  const response = await axios
                                  .post(`${env.qr_url}/send-otp`, _postData)
                                  .then((res: any) => {
                                    // console.log(res)
                                    // data = res;
                                  });
                              }catch(err){
        
                              }
                        }
                    }

                }

                game.isComplete = true
                game.status = 'refunded'
                
                await game.save()
                let data = {
                    data: {
                        resData
                    },
                    message: 'Round refund successful'

                }

                return await this.returnData(data)
            } catch (err: any) {
                throw new ConflictException('Refund error')
            }
        } else {
            throw new NotAcceptableException('Game not found')
        }
    }

    async update(datas: any): Promise<any> {

        let { round, action, youtubeLink, youtubeLiveLink, facebookLink, facebookLiveLink } = datas
        var game: any = await this.gameModel.findOne({ round: round })
        if (game) {
            try {
                if (action == 'finalise') {
                    if (game.isComplete) {
                        throw new NotAcceptableException('Round already completed')
                    } else {
                        game.isComplete = true
                        game.status = 'finalise'
                        await game.save()
                        let data = {
                            data: {
                                game
                            },
                            message: 'Round completed'

                        }
                        return await this.returnData(data)
                    }
                }
                else if (action == 'refund') {
                    return await this.refund(datas)

                } else if (action === 'linkUpdate') {
                    game.youtubeLink = youtubeLink,
                        game.youtubeLiveLink = youtubeLiveLink,
                        game.facebookLink = facebookLink,
                        game.facebookLiveLink = facebookLiveLink,

                        await game.save()

                    let data = {
                        data: {
                            game
                        },
                        message: 'Round link updated'

                    }
                    return await this.returnData(data)
                }
                else {
                    throw new NotAcceptableException('Something went wrong')
                }

            } catch (err) {
                throw new NotAcceptableException(err)
            }
        }

    }

    async returnData(data: any) {
        let retData = {
            message: data.message,
            data: data.data,
            statusCode: 201
        }
        return retData
    }

    async updateRewardType(data: any) {  //need to revert the values
        try {
            let { round, rewardType, winnerList } = data;

            var game: any = await this.gameModel.findOne({ round: round })


            /**
             * Need to uncommand the below code
             * 
             */
            if (game.winnerList.length > 0) {
                throw new UnauthorizedException('Already reward sent');
            }

            let prizes = game.prize;

            if (game.isComplete === false) {
                throw new UnauthorizedException('Round is not completed yet')
            }

            if (rewardType === 'other') {

                if (winnerList.length <= 1) {
                    game.rewardType = rewardType;
                    await game.save();
                }
                if (winnerList.length > 1) {
                    for (let i = 1; i < prizes.length; i++) {
                        let convertPrize = parseInt(prizes[i]);
                        let convertWinnerList = parseInt(winnerList[i]);

                        convertWinnerList -= 1;

                        if (typeof (convertPrize) != 'number' || typeof (convertWinnerList) != 'number') {
                            throw new UnauthorizedException("Prize or WinnerList type is not an number");
                        }

                        let user = await this.userModel.findOne({ username: game.tokenDetails[convertWinnerList].selectedBy });

                        if (!user) {
                            throw new UnauthorizedException("No data found for the given winner list");
                        }

                        user.wallet += await convertPrize;
                        await user.save();
                    }

                    game.rewardType = rewardType;
                    game.winnerList = winnerList;

                    await game.save();
                    let data = {
                        data: {
                            game
                        },
                        message: 'Reward type is updated'

                    }
                    return await this.returnData(data);
                }
            }
            else if (rewardType === 'cash') {
                if (winnerList.length === 0) {
                    throw new UnauthorizedException("Update winner list");
                }

                for (let i = 0; i < prizes.length; i++) {
                    let convertPrize = parseInt(prizes[i]);
                    let convertWinnerList = parseInt(winnerList[i]);

                    convertWinnerList -= 1;

                    if (typeof (convertPrize) != 'number' || typeof (convertWinnerList) != 'number') {
                        throw new UnauthorizedException("Prize or WinnerList type is not an number");
                    }

                    let user = await this.userModel.findOne({ username: game.tokenDetails[convertWinnerList].selectedBy });

                    if (!user) {
                        throw new UnauthorizedException("No data found for the given winner list");
                    }

                    let userPrice = user.wallet;
                    const timestamp = new Date().getTime();
                    user.wallet = await userPrice + convertPrize;
                    let txnHistory: any = {
                        message: `Round ${game.round} winner`,
                        amount: convertPrize,
                        time: timestamp,
                        // newBalance: refAddress.wallet
                      }
                      user.txnHistory.push(txnHistory)
                      try{
                        const _postData = {
                            // Data to be sent in the request body
                            number: user.number,
                            message: `Congrats You are the winner - Round - ${game.round} - Rs ${convertPrize} \n check here - teamquantum.in/user/transaction-history`,
                          };
                          const response = await axios
                          .post(`${env.qr_url}/send-otp`, _postData)
                          .then((res: any) => {
                            // console.log(res)
                            // data = res;
                          });
                      }catch(err){

                      }
                    await user.save();
                }

                game.rewardType = rewardType;
                game.winnerList = winnerList;

                await game.save();
                let data = {
                    data: {
                        game
                    },
                    message: 'Reward type is updated'

                }
                return await this.returnData(data);
            }
            else {
                throw new UnauthorizedException('Check reward type');
            }
        } catch (err) {
            console.log(err)
            throw new UnauthorizedException(err);
        }
    }
}
