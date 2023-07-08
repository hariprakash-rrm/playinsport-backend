import { Body, Get, Injectable, NotAcceptableException, Post, UnauthorizedException } from '@nestjs/common';
import { GetUserDto, UpdateUserDto, UserWalletDto } from '../games/create/dto/createToken.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from '../games/create/schemas/create.schema';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class UserService {

constructor(@InjectModel(Game.name)
private gameModel: Model<Game>, @InjectModel(User.name)
    private userModel: Model<User>){}
    
    async getUser(data: any): Promise<any> {
        let { username } = data

        let user = await this.userModel.findOne({ username: username })
        if (user) {
            let res = {
                data: {
                    username: user.username,
                    number: user.number,
                    wallet: user.wallet,
                    verified: user.verified,
                    txnHistory: user.txnHistory
                },
                message: 'user retrived'
            }
            return await this.returnData(res)
        } else {
            throw new NotAcceptableException('User not found')
        }
    }

    async updateUser(data: any): Promise<any> {
        console.log(data);
        let { username, number, wallet, block } = data
       
        let userFromName = await this.userModel.findOne({ username: username })
        let userFromNumber = await this.userModel.findOne({ number: number })

        if (userFromName) {
            userFromName.username = await username
            userFromName.wallet = await wallet
            userFromName.block = await block
            await userFromName.save()
            let res = {
                data: {
                    username: await username,
                    wallet: await wallet,
                    block: await block
                },
                message: 'User details updated'

            }
            return await this.returnData(res)
        } else if (userFromNumber) {
            userFromNumber.username = await username
            userFromNumber.wallet = await wallet
            await userFromNumber.save()
            let res = {
                data: {
                    username: username,
                    wallet: wallet
                },
                message: 'User details updated'
            }
            return await this.returnData(res)
        }
        else {
            throw new NotAcceptableException('User not found')
        }


    }

    async updateUserWallet(data: any): Promise<any> {

        let { username, wallet, number } = data

        let userFromName = await this.userModel.findOne({ username: username })
        let userFromNumber = await this.userModel.findOne({ number: number })
        if (userFromName) {
            userFromName.wallet = await wallet
            await userFromName.save()
            let res = {
                data: {
                    username: userFromName.username,
                    wallet: userFromName.wallet
                },
                message: 'Wallet updated'
            }
            return await this.returnData(res)
        } else if (userFromNumber) {
            userFromNumber.wallet = await wallet
            await userFromNumber.save()
            let res = {
                data: {
                    username: userFromNumber.username,
                    wallet: userFromNumber.wallet
                },
                message: 'Wallet updated'
            }
            return await this.returnData(res)
        } else {
            throw new UnauthorizedException('User not found')
        }

    }

    async getAllUser(){
        let users = await this.userModel.find()
        
    }

    async returnData(data: any) {
        let retData = {
            message: data.message,
            data: data.data,
            statusCode: 201
        }
        return retData
    }

}
