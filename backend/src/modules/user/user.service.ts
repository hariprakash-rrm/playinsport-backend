import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from '../games/create/schemas/create.schema';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { ExcelService } from '../shared/excelService';
import { DepositWallet, WithdrawWallet } from '../auth/schemas/wallet.schema';


@Injectable()
export class UserService {

    constructor(@InjectModel(Game.name,
    )
    private gameModel: Model<Game>, @InjectModel(User.name)
        private userModel: Model<User>, @InjectModel(DepositWallet.name)
        private depositWallet: Model<DepositWallet>,
        @InjectModel(WithdrawWallet.name)
        private withdrawWalletModel: Model<WithdrawWallet>,
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
            statusCode: data?.statusCode ?? 201
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

    async deposit(data): Promise<any> {
        let { transactionId } = data
        let { userPhoneNumber } = data
        if (data.method == 'deposit') {
            let isId = await this.depositWallet.findOne({ transactionId: transactionId })
            if (isId) {
                throw new NotAcceptableException('duplicate id found')
            }
            let userTxn = await this.depositWallet.find({ userPhoneNumber: userPhoneNumber })
                .sort({ _id: -1 })
                .limit(1)
                .exec();
            if (userTxn) {
                if (userTxn[0]?.method == 'deposit' ) {
                    if (userTxn[0]?.status == 'pending' ) {
                        throw new NotAcceptableException('Previous deposit pending')
                    }
                }
            }
            try {
                let { transactionId, amount, mobileNumber, paymentMethod, userPhoneNumber, message, method } = data
                console.log(data);
                let transactionDetails = await this.depositWallet.create({
                    transactionId,
                    amount,
                    mobileNumber,
                    method,
                    paymentMethod,
                    userPhoneNumber,
                    message: 'Deposit In progress...'
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
        } else if (data.method == 'withdraw') {

            let userTxn = await this.withdrawWalletModel.find({ userPhoneNumber: userPhoneNumber })
                .sort({ _id: -1 })
                .limit(1)
                .exec();
            if (userTxn) {
                if (userTxn[0]?.method == 'withdraw' ) {
                    if (userTxn[0]?.status == 'pending') {
                        throw new NotAcceptableException('Previous withdraw pending')
                    }
                }
            }
            try {
                console.log(data);
                let { amount, userPhoneNumber, method } = data
                console.log(amount)
                let _transactionDetails = await this.withdrawWalletModel.create({
                    amount: amount,
                    method: method,
                    userPhoneNumber: userPhoneNumber,
                    message: 'WIthdraw In progress...'
                });

                try {
                    const savedTransaction = await _transactionDetails.save();
                    console.log('Transaction saved successfully:', savedTransaction);
                  } catch (error) {
                    console.error('Error saving transaction:', error);
                  }
                let res = {
                    data: {
                        data: _transactionDetails
                    },
                    message: 'Submitted',
                }
                return await this.returnData(res)
            }
            catch (err) {
                throw new NotAcceptableException('no methods found')
            }
        }

    }

    async getUserWalletTxn(data: any): Promise<any> {
        let { userPhoneNumber } = data
        try {
            var userTxn = await this.depositWallet.find({ userPhoneNumber: userPhoneNumber })
                .sort({ _id: -1 })
                .limit(50)
                .exec();
            console.log(userTxn)
            if (!userTxn || data.userTxn === 0) {
                throw new NotFoundException('No data found for the given number.');
            }
            let _data = {
                data: {
                    data: userTxn
                },
                message: 'Data retrived'
            }
            return this.returnData(_data)
        } catch {
            let _data = {
                data: {
                    data: []
                },
                message: 'NO data found'
            }
            return this.returnData(_data)
        }
    }

}
