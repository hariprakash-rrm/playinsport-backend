import { ConflictException, Injectable, MethodNotAllowedException, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './schemas/create.schema';
import { Model } from 'mongoose';
import { RefundDto } from './dto/createToken.dto';
import { User } from 'src/modules/auth/schemas/user.schema';

@Injectable()
export class CreateService {
    constructor(@InjectModel(Game.name)
    private gameModel: Model<Game>, @InjectModel(User.name)
        private userModel: Model<User>) { }

    async get(data: any) {
        let round = data.data
        try {
            let game = await this.gameModel.findOne({ round: round })
            console.log(game)
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
        // console.log(dates)
        try {
            const dateString = dates.dates
            const _date: any = new Date(dateString);
            let games = await this.gameModel.find({ date: _date });
            console.log(games)
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
            let { name, prize, tokenPrice, date, maximumTokenPerUser, totalTokenNumber } = data
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
                console.log("MAD")
            }
            try {
                let count = await this.gameModel.countDocuments().exec();
                console.log(`count${count}`)
                var game: any = await this.gameModel.create({
                    round: count + 1, name, date, prize, tokenPrice, maximumTokenPerUser, tokenDetails, isComplete: false, status: 'live'
                })
                console.log(`game${game}`);
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
        let { round } = data

        var game: any = await this.gameModel.findOne({ round: round })

        if (game) {
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
            throw new NotAcceptableException('game not found')
        }
    }

    async update(datas: any): Promise<any> {
        let { round, action } = datas
        var game: any = await this.gameModel.findOne({ round: round })
        if (game) {
            try {
                if (game.isComplete) {
                    throw new NotAcceptableException('Round already completed')
                }
                else {
                    if (action == 'finalise') {
                        game.isComplete = true
                        game.status = 'finalise'
                        game.save()
                        let data = {
                            data: {
                                game
                            },
                            message: 'Round completed'

                        }
                        return await this.returnData(data)
                    } else if (action == 'refund') {
                        return await this.refund(datas)

                    } else {
                        throw new NotAcceptableException('Something went wrong')
                    }
                }
            } catch (err) {
                throw new NotAcceptableException(err)
            }
        }

    }

    // async getUser(data: any): Promise<any> {
    //     let { username } = data
    //     // let admin: any = await this.userModel.findOne({ token: token })

    //     let user = await this.userModel.findOne({ username: username })
    //     if (user) {
    //         let res = {
    //             data: {
    //                 username: user.username,
    //                 number: user.number,
    //                 wallet: user.wallet,
    //                 verified: user.verified,
    //                 txnHistory: user.txnHistory
    //             },
    //             message: 'user retrived'

    //         }

    //         return await this.returnData(res)
    //     } else {
    //         throw new NotAcceptableException('User not found')
    //     }
    // }

    // async updateUser(data: any): Promise<any> {
    //     let { username, number, wallet, block } = data
    //     // let admin=await this.userModel.findOne({token:token})


    //     let userFromName = await this.userModel.findOne({ username: username })
    //     let userFromNumber = await this.userModel.findOne({ number: number })

    //     if (userFromName) {
    //         userFromName.username = await username
    //         userFromName.wallet = await wallet
    //         userFromName.block = await block
    //         await userFromName.save()
    //         let res = {
    //             data: {
    //                 username: await username,
    //                 wallet: await wallet,
    //                 block: await block
    //             },
    //             message: 'User details updated'

    //         }
    //         return await this.returnData(res)
    //     } else if (userFromNumber) {
    //         userFromNumber.username = await username
    //         userFromNumber.wallet = await wallet
    //         await userFromNumber.save()
    //         let res = {
    //             data: {
    //                 username: username,
    //                 wallet: wallet
    //             },
    //             message: 'User details updated'
    //         }

    //         return await this.returnData(res)
    //     }
    //     else {
    //         throw new NotAcceptableException('User not found')
    //     }


    // }

    // async updateUserWallet(data: any): Promise<any> {

    //     let { username, wallet, number } = data

    //     let userFromName = await this.userModel.findOne({ username: username })
    //     let userFromNumber = await this.userModel.findOne({ number: number })
    //     if (userFromName) {
    //         userFromName.wallet = await wallet
    //         await userFromName.save()
    //         let res = {
    //             data: {
    //                 username: userFromName.username,
    //                 wallet: userFromName.wallet
    //             },
    //             message: 'Wallet updated'
    //         }
    //         return await this.returnData(res)
    //     } else if (userFromNumber) {
    //         userFromNumber.wallet = await wallet
    //         await userFromNumber.save()
    //         let res = {
    //             data: {
    //                 username: userFromNumber.username,
    //                 wallet: userFromNumber.wallet
    //             },
    //             message: 'Wallet updated'
    //         }
    //         return await this.returnData(res)
    //     } else {
    //         throw new UnauthorizedException('User not found')
    //     }

    // }

    async returnData(data: any) {
        let retData = {
            message: data.message,
            data: data.data,
            statusCode: 201
        }
        return retData
    }


}
