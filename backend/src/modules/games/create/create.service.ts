import { ConflictException, Injectable, MethodNotAllowedException, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './schemas/create.schema';
import mongoose, { Model } from 'mongoose';
import { RefundDto } from './dto/createToken.dto';
import { User } from 'src/modules/auth/schemas/user.schema';
import { handleRetry } from '@nestjs/mongoose/dist/common/mongoose.utils';
import { ReadStream } from 'fs';
@Injectable()
export class CreateService {
    constructor(@InjectModel(Game.name)
    private gameModel: Model<Game>, @InjectModel(User.name)
        private userModel: Model<User>) { }


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
                    round: count + 1, name, date, prize, tokenPrice, maximumTokenPerUser, tokenDetails, isComplete: false
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

        let game: any = await this.gameModel.findOne({ round: round })

        if (game) {
            try {
                const resData = []
                const timestamp = new Date().getTime();
                for (let i = 0; i < game.tokenDetails.length; i++) {
                    if (game.tokenDetails[i].isSelected) {
                        let partUser = await this.userModel.findOne({ number: game.tokenDetails[i].number })
                        if (partUser) {
                            partUser.wallet += +game.tokenPrice
                            let txnHistory: any = {
                                message: `Round : ${game.round} refund `,
                                amount: game.tokenPrice,
                                time: timestamp
                            }
                            await partUser.txnHistory.push(txnHistory)
                            await resData.push(partUser.txnHistory)
                            await partUser.save()
                        }
                    }
                    let res = {
                        data: {
                            data: resData
                        },
                        message: 'Round refund successful'

                    }

                    return await this.returnData(res)
                }
            } catch (err: any) {
                throw new ConflictException('Refund error')
            }
        } else {
            throw new NotAcceptableException('game not found')
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
