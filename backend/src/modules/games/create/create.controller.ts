import { Body, Controller, Get, Post, Query, UnauthorizedException } from '@nestjs/common';
import { createTokenDto, GetUserDto, RefundDto, UpdateUserDto, UserWalletDto } from './dto/createToken.dto';
import { CreateService } from './create.service';
import { AuthService } from 'src/modules/auth/auth.service';

@Controller('token')
export class CreateController {
    constructor(private createService: CreateService, private adminValidate: AuthService) { }

    @Post('/create')
    async create(@Body() data: createTokenDto): Promise<any> {

        let { token } = data
        let isAdmin = await this.adminValidate.adminValidate(token)
        if (isAdmin) {
            return this.createService.create(data)
        }
        else {
            throw new UnauthorizedException(' You are not an admin')
        }
    }

    @Get('/get')
    async get(@Query() round: string): Promise<any> {
        return this.createService.get(round)
    }

    @Get('/games')
    async getGame(@Query() dates: any): Promise<any> {
        return this.createService.getGames(dates)
    }

    @Post('/refund')
    async refund(@Body() data: RefundDto): Promise<any> {
        let { token } = data
        let isAdmin = await this.adminValidate.adminValidate(token)
        if (isAdmin) {
            return this.createService.refund(data)
        }
        else {
            throw new UnauthorizedException(' You are not an admin')
        }
    }

    @Post('/update')
    async update(@Body() data: any) {
        let { token } = data
        let isAdmin = await this.adminValidate.adminValidate(token)
        if (isAdmin) {
            return this.createService.update(data)
        }
        else {
            throw new UnauthorizedException(' You are not an admin')
        }
    }

}


