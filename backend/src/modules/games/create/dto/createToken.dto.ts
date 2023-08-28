import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, Matches, isNotEmpty, } from "class-validator";


export class createTokenDto {

    @IsNotEmpty()
    readonly name: string

    @IsNotEmpty()
    readonly image: string

    @IsArray()
    readonly prize: string[]

    @IsNotEmpty()
    readonly tokenPrice: string

    @IsNotEmpty()
    readonly date: string

    @IsNotEmpty()
    readonly maximumTokenPerUser: string

    @IsNotEmpty()
    readonly token: string


    readonly facebookLink: string
    readonly youtubeLink: string

}

export class RefundDto {

    @IsNotEmpty()
    readonly round: number

    @IsNotEmpty()
    readonly token: string
}

export class GetUserDto {

    @IsNotEmpty()
    @Matches(/^[^\s]+$/, {
        message: 'Username cannot contain spaces',
    })
    readonly username: string

    @IsNotEmpty()
    readonly token: string
}

export class GetUserDetailsDto {
    @IsNotEmpty()
    readonly token: string
    readonly userPhoneNumber: number
}

export class walletDto {

    @IsNotEmpty()
    paymentMethod: string
    transactionid: string
    amount: number
    mobileNumber: number
    userPhoneNumber: number
    token: string

}

export class UpdateUserDto {

    @IsNotEmpty()
    @Matches(/^[^\s]+$/, {
        message: 'Username cannot contain spaces',
    })
    readonly username: string
    readonly token: string

    @IsNotEmpty()
    @IsNumber()
    readonly number: number
    readonly wallet: number

    @IsNotEmpty()
    @IsBoolean()
    readonly block: boolean = false


}

export class UserWalletDto {

    @IsNotEmpty()
    @IsNumber()
    readonly number: number
    readonly wallet: number

    @IsNotEmpty()
    @IsString()
    readonly token: string

}

export class returnUserDetailsDto {
    @IsNotEmpty()
    @IsNumber()
    readonly number: number

    @IsNotEmpty()
    @IsBoolean()
    readonly isAdmin: boolean = false

    @IsNotEmpty()
    readonly name: string

    readonly wallet: number
    readonly txnHistory: any

}

export class UpdatePaymentDto {

    @IsNotEmpty()
    token: string
    method: string
    userPhoneNumber: number
    amount: number
    message: string
}
