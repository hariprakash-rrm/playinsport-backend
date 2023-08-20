import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from '../games/create/schemas/create.schema';
import { LeanDocument, Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { ExcelService } from '../shared/excelService';
import { DepositWallet, TotalSupply, WithdrawWallet } from '../auth/schemas/wallet.schema';
import { promises } from 'dns';


@Injectable()
export class UserService {


    constructor(@InjectModel(Game.name,
    )
    private gameModel: Model<Game>, @InjectModel(User.name)
        private userModel: Model<User>, @InjectModel(DepositWallet.name)
        private depositWallet: Model<DepositWallet>,
        @InjectModel(WithdrawWallet.name)
        private withdrawWalletModel: Model<WithdrawWallet>,

        @InjectModel(TotalSupply.name)
        private TotalSupplyModel: Model<TotalSupply>,
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
                        reward:user.reward,
                        txnHistory: user.txnHistory,
                        isAdmin: user.isAdmin,
                        referralCode: user.referralCode
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

    async deposit(data: any): Promise<any> {
        let { transactionId } = data
        var { userPhoneNumber } = data
        if (data.method == 'deposit') {
            let isId = await this.depositWallet.findOne({ transactionId: transactionId })

            let depositCount = await this.depositWallet.find();
            let CountOfDeposit = depositCount.length;
            if (isId) {
                throw new NotAcceptableException('duplicate id found')
            }
            let userTxn = await this.depositWallet.find({ userPhoneNumber: userPhoneNumber })
                .sort({ _id: -1 })
                .limit(1)
                .exec();
            if (userTxn) {
                if (userTxn[0]?.method == 'deposit') {
                    if (userTxn[0]?.status == 'pending') {
                        throw new NotAcceptableException('Previous deposit pending')
                    }
                }
            }
            try {
                let { transactionId, amount, mobileNumber, paymentMethod, userPhoneNumber, message, method } = data
                let transactionDetails = await this.depositWallet.create({
                    transactionId,
                    amount,
                    mobileNumber,
                    method,
                    paymentMethod,
                    userPhoneNumber,
                    message: 'Deposit In progress...',
                    DepositTransactionId: CountOfDeposit
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
                if (userTxn[0]?.method == 'withdraw') {
                    if (userTxn[0]?.status == 'pending') {
                        throw new NotAcceptableException('Previous withdraw pending')
                    }
                }
            }
            let { amount, method } = data

            let user = await this.userModel.findOne({ number: userPhoneNumber })
            if (user) {
                try {
                    if ((+user.wallet - +amount) < 0) {
                        throw new NotAcceptableException('Try with lower amount')

                    }

                    let withdrawCount = await this.depositWallet.find();
                    let CountOfWithdraw = withdrawCount.length;

                    let _transactionDetails = await this.withdrawWalletModel.create({
                        amount: amount,
                        method: method,
                        userPhoneNumber: userPhoneNumber,
                        message: 'WIthdraw In progress...',
                        withdrawTransactionId: CountOfWithdraw
                    });
                    user.wallet -= amount
                    await _transactionDetails.save();
                    await user.save()
                    let res = {
                        data: {
                            data: _transactionDetails
                        },
                        message: 'Submitted',
                    }
                    return await this.returnData(res)

                } catch (err) {
                    throw new NotAcceptableException('contact admin')
                }
            } else {
                throw new UnauthorizedException('user not found')
            }

        } else {
            throw new NotAcceptableException('NO methods found')
        }

    }

    async getUserWalletTxn(data: any): Promise<any> {
        let { userPhoneNumber } = data
        try {
            const depositUserTxn = await this.depositWallet.find({ userPhoneNumber: userPhoneNumber })
                .sort({ createdAt: -1 })
                .lean()
                .limit(25)
                .exec();
            const withdrawUserTxn = await this.withdrawWalletModel.find({ userPhoneNumber: userPhoneNumber })
                .sort({ createdAt: -1 })
                .lean()
                .limit(25)
                .exec();


            const data = [...depositUserTxn, ...withdrawUserTxn].sort((a: LeanDocument<any>, b: LeanDocument<any>) =>
                b.createdAt.getTime() - a.createdAt.getTime()
            );
            if (data.length == 0) {
                throw new NotFoundException('No data found for the given number.');
            }

            let _data = {
                data: {
                    data:
                        data
                },
                message: 'Data retrived'
            }
            return this.returnData(_data)
        } catch {
            throw new NotFoundException('NO data found')
        }
    }

    async getDepositPayment(data: any): Promise<any> {
        let { method } = data
        let userPayment = await this.depositWallet.find({ status: method })
        if (userPayment.length == 0) {
            throw new NotAcceptableException('No data found')
        }
        if (userPayment) {
            let _data = {
                data: {
                    data:
                        userPayment
                },
                message: 'Data retrived'
            }
            return this.returnData(_data)
        }
        else {
            throw new NotFoundException('No deposit payments')
        }
    }

    async getWithdrawPayment(data: any): Promise<any> {
        let { method } = data
        let userPayment = await this.withdrawWalletModel.find({ status: method })
        if (userPayment.length == 0) {
            throw new NotAcceptableException('No data found')
        }
        if (userPayment) {
            let _data = {
                data: {
                    data:
                        userPayment
                },
                message: 'Data retrived'
            }
            return this.returnData(_data)

        }
        else {
            throw new NotFoundException('no withdraw payments')
        }
    }


    async updatePayment(data: any): Promise<any> {
        let totalSupplyModel = await this.TotalSupplyModel.find();

        const timestamp = new Date().getTime();
        let { method, userPhoneNumber, amount, message } = data
        let user = await this.userModel.findOne({ number: userPhoneNumber })

        if (method == 'deposit') {

            if (user) {

                let depositUserTxn = await this.depositWallet.find({ userPhoneNumber: userPhoneNumber })
                    .sort({ createdAt: -1 }).exec();

                user.wallet += depositUserTxn[0].amount

                if (totalSupplyModel.length === 0) {
                    let totalSupply = await this.TotalSupplyModel.create({
                        totalDeposit: depositUserTxn[0].amount,
                        totalWithdraw: 0
                    });
                    await totalSupply.save();
                } else {
                    let value = await this.TotalSupplyModel.findOneAndUpdate({ _id: totalSupplyModel[0]._id });
                    value.totalDeposit += depositUserTxn[0].amount;
                    await value.save();
                }

                if (+amount != +depositUserTxn[0].amount) {
                    throw new NotAcceptableException('Amount mismatched')
                }

                let txnHistory: any = {
                    message: `Deposited`,
                    amount: +depositUserTxn[0].amount,
                    time: timestamp,
                    newBalance: user.wallet
                }

                if (depositUserTxn[0].status == 'pending') {
                    user.txnHistory.push(txnHistory)
                    depositUserTxn[0].status = 'deposited'
                    depositUserTxn[0].message = message

                    await depositUserTxn[0].save()
                    await user.save()

                    let _data = {
                        data: {
                            data:
                                depositUserTxn[0]
                        },
                        message: 'Deposited'
                    }
                    return this.returnData(_data)

                } else {
                    throw new NotAcceptableException('Already deposited')
                }

            } else {
                throw new NotAcceptableException('User not found')
            }
        }
        else if (method == 'declineDeposit') {
            let depositUserTxn = await this.depositWallet.find({ userPhoneNumber: userPhoneNumber })
                .sort({ createdAt: -1 })

            let txnHistory: any = {
                message: message,
                amount: +depositUserTxn[0].amount,
                time: timestamp,
                newBalance: user.wallet
            }

            if (depositUserTxn[0].status == 'pending') {
                depositUserTxn[0].status = 'declined'
                depositUserTxn[0].message = message

                user.txnHistory.push(txnHistory)
                await user.save()
                await depositUserTxn[0].save()

                let _data = {
                    data: {
                        data:
                            depositUserTxn[0]
                    },
                    message: 'dEPOSIT DECLINED'
                }
                return this.returnData(_data)
            } else {
                throw new NotAcceptableException('Already declined')
            }
        } else if (method == 'withdraw') {

            let withdrawUserTxn = await this.withdrawWalletModel.find({ userPhoneNumber: userPhoneNumber })
                .sort({ createdAt: -1 })

            let txnHistory: any = {
                message: `Withdrawn `,
                amount: +withdrawUserTxn[0].amount,
                time: timestamp,
                newBalance: user.wallet
            }

            if (withdrawUserTxn[0].status == 'pending') {
                user.txnHistory.push(txnHistory)
                withdrawUserTxn[0].status = 'withdrawn'
                withdrawUserTxn[0].message = message

                await withdrawUserTxn[0].save()
                await user.save()

                let value = await this.TotalSupplyModel.findOneAndUpdate({ _id: totalSupplyModel[0]._id });
                value.totalWithdraw += withdrawUserTxn[0].amount;
                await value.save();

                let _data = {
                    data: {
                        data:
                            withdrawUserTxn[0]
                    },
                    message: 'withdraw success'
                }
                return this.returnData(_data)
            } else {
                throw new NotAcceptableException('Already withdrawn')
            }
        } else if (method == 'declineWithdraw') {
            let withdrawUserTxn = await this.withdrawWalletModel.find({ userPhoneNumber: userPhoneNumber })
                .sort({ createdAt: -1 })

            user.wallet += withdrawUserTxn[0].amount
            let txnHistory: any = {
                message: message,
                amount: +withdrawUserTxn[0].amount,
                time: timestamp,
                newBalance: user.wallet
            }


            if (withdrawUserTxn[0].status == 'pending') {
                user.txnHistory.push(txnHistory)
                withdrawUserTxn[0].status = 'declined'
                withdrawUserTxn[0].message = message

                await withdrawUserTxn[0].save()
                await user.save()

                let _data = {
                    data: {
                        data:
                            withdrawUserTxn[0]
                    },
                    message: 'withdraw declined'
                }
                return this.returnData(_data)
            } else {
                throw new NotAcceptableException('Already declined')
            }
        } else {
            throw new NotAcceptableException('NO methods found')
        }
    }

    async getTotalSupply(): Promise<any> {
        try {
            let totalSupplyModel = await this.TotalSupplyModel.find();

            let totalSupply = totalSupplyModel[0].totalDeposit - totalSupplyModel[0].totalWithdraw;
            let _data = {
                data: {
                    data:
                        totalSupply
                },
                message: 'withdraw declined'
            }
            return this.returnData(_data);
        } catch (err) {
            throw new NotAcceptableException('Something went wrong')
        }
    }

    // async getDepositTransaction(data: any): Promise<any> {
    //     let { transactionId } = data
    //     let userPayment = await this.depositWallet.find({ DepositTransactionId: transactionId })
    //     console.log("USer PAyMENT",userPayment);
    //     if (userPayment.length == 0) {
    //         throw new NotAcceptableException('No data found')
    //     }
    //     if (userPayment) {
    //         let _data = {
    //             data: {
    //                 data:
    //                     userPayment
    //             },
    //             message: 'Data retrived'
    //         }
    //         return this.returnData(_data)
    //     }
    //     else {
    //         throw new NotFoundException('No deposit payments')
    //     }
    // }

    async searchTransaction(data: any): Promise<any> {
        let { transactionId, method } = data
        console.log("data", data);
        if (method === 'withdraw') {
            let withdrawTransactionId = parseInt(transactionId);
            let userPayment = await this.withdrawWalletModel.find({ withdrawTransactionId: withdrawTransactionId })
            console.log("USer PAyMENT", userPayment);
            if (userPayment.length == 0) {
                throw new NotAcceptableException('No data found')
            }
            if (userPayment) {
                let _data = {
                    data: {
                        data:
                            userPayment
                    },
                    message: 'Data retrived'
                }
                return this.returnData(_data)
            }
            else {
                throw new NotFoundException('No deposit payments')
            }
        } else if (method === 'deposit') {
            let DepositTransactionId = parseInt(transactionId);
            console.log(DepositTransactionId);
            let userPayment = await this.depositWallet.find({ DepositTransactionId: DepositTransactionId })
            console.log("USer PAyMENT", userPayment);
            if (userPayment.length == 0) {
                throw new NotAcceptableException('No data found')
            }
            if (userPayment) {
                let _data = {
                    data: {
                        data:
                            userPayment
                    },
                    message: 'Data retrived'
                }
                return this.returnData(_data)
            }
            else {
                throw new NotFoundException('No deposit payments')
            }
        } else {
            throw new NotFoundException('Method not found')
        }
    }


}
