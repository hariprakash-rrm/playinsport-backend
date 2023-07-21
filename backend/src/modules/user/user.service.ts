import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from '../games/create/schemas/create.schema';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { ExcelService } from '../shared/excelService';
import { Wallet } from '../auth/schemas/wallet.schema';
import { promises } from 'dns';

@Injectable()
export class UserService {

    constructor(@InjectModel(Game.name,
    )
    private gameModel: Model<Game>, @InjectModel(User.name)
        private userModel: Model<User>, @InjectModel(Wallet.name)
        private walletModel: Model<Wallet>,
        private readonly excelService: ExcelService) { }

    async getUser(data: any): Promise<any> {
        try {
            let { username }: any = data
            if (!username) {
                let res = {
                    message: 'User Not found'
                }
                return res;
            } else if (username > 0) {
                var user = await this.userModel.findOne({ number: username })
            }
            else {
                user = await this.userModel.findOne({ username: username })
            }

            if (user) {
                let res = {
                    data: {
                        username: user.username,
                        number: user.number,
                        wallet: user.wallet,
                        verified: user.verified,
                        txnHistory: user.txnHistory,
                        block: user.block
                    },
                    message: 'user retrived'
                }
                return await this.returnData(res)
            } else {
                throw new NotAcceptableException('User not found')
            }
        } catch (err) {
            let res = {
                message: "Something went wrong"
            }
            return await this.returnData(res);
        }
    }

    async updateUser(data: any): Promise<any> {
        try {
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
        } catch (err) {
            let res = {
                message: 'Something went wrong'
            }
            return res;
        }

    }

    async updateUserWallet(data: any): Promise<any> {
        try {
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

        } catch (err) {
            let res = {
                message: 'Something went wrong'
            }
            return res;
        }
    }

    async getAllUser() {
        try {
            let users = await this.userModel.find();
            if (users) {
                const value: any[] = []

                users.forEach(function (user) {
                    let res = {
                        data: {
                            username: user.username,
                            number: user.number,
                            wallet: user.wallet,
                            verified: user.verified,
                            txnHistory: user.txnHistory,
                            block: user.block
                        }
                    }
                    value.push(res);
                })
                return value;
            }
        } catch (err) {
            let res = {
                message: 'Something went wrong'
            }
            return res;
        }
    }

    async getAllUserForPage(currentPage: number, selectedItemsPerPage: number) {
        try {
            let users = await this.userModel.find();

            const startIndex = (currentPage - 1) * selectedItemsPerPage;
            const endIndex = startIndex + selectedItemsPerPage;
            const totalPages = Math.ceil(users.length / selectedItemsPerPage);
            const pagedUsers = users.slice(startIndex, endIndex);

            if (pagedUsers) {
                const value: any[] = [];

                pagedUsers.forEach(function (user) {
                    let res = {
                        data: {
                            username: user.username,
                            number: user.number,
                            wallet: user.wallet,
                            verified: user.verified,
                            txnHistory: user.txnHistory,
                            block: user.block
                        }
                    };
                    value.push(res);
                });

                let totalItem = users.length;

                return { totalItem, value }; // Return an object with totalItem and value properties
            }
        } catch (err) {
            let res = {
                message: 'Something went wrong'
            };
            return res;
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

    async getUserDetails(data: any): Promise<any> {
        let { token } = data
        try {
            let user = await this.userModel.findOne({ token: token })
            if (user) {
                let res = {
                    data: {
                        username: user.username,
                        number: user.number,
                        wallet: user.wallet,
                        txnHistory: user.txnHistory,
                        isAdmin: user.isAdmin
                    },
                    message: 'user retrived'
                }
                return await this.returnData(res)
            } else {
                throw new NotAcceptableException('User not found')
            }
        } catch (err) {
            throw new NotAcceptableException({
                StatusCode: err.statusCode,
                Message: err.message
            })
        }
    }

    async exportUsersToExcel(res): Promise<any> {
        try {

            const users = await this.userModel.find();
            const buffer = await this.excelService.exportToExcel(users);
            console.log(buffer);

            // Set the appropriate response headers
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=user_details.xlsx');

            // Send the buffer as the response
            res.send(buffer);
        } catch (err) {
            throw new NotAcceptableException({
                statusCode: err.statusCode || 500,
                message: err.message || 'Error exporting to Excel',
            });
        }
    }

    async walletTransaction(data): Promise<any> {
        let { transactionId } = data
        let isId = await this.walletModel.findOne({ transactionId: transactionId })
        if (isId) {
            throw new NotAcceptableException('duplicate id found')
        }
        try {

            let { transactionId, amount, mobileNumber, paymentMethod, userPhoneNumber, message } = data
            console.log(data);
            var transactionDetails = await this.walletModel.create({
                transactionId,
                amount,
                mobileNumber,
                paymentMethod,
                userPhoneNumber,
                message
            });

            await transactionDetails.save();

            let res = {
                data: {
                    data: transactionDetails
                },
                message: 'Submitted',
            }
            return await this.returnData(res)

        } catch (err) {
            throw new NotAcceptableException({
                statusCode: err.statusCode,
                message: err.message
            })
        }
    }

    async getUserWalletTxn(data: any): Promise<any> {
        let { userPhoneNumber } = data
        let userTxn = await this.walletModel.find({ userPhoneNumber: userPhoneNumber })
            .sort({ _id: -1 })
            .limit(50)
            .exec();

        if (!userTxn || data.userTxn === 0) {
            throw new NotFoundException('No data found for the given number.');
        }

        let _data = {
            data: {
                data: userTxn
            },
            message: 'Data retrived'
        }

        this.returnData(_data)
    }

}
