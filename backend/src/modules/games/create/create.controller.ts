import { Body, Controller, Get, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { createTokenDto, GetUserDto, RefundDto, UpdateUserDto, UserWalletDto } from './dto/createToken.dto';
import { CreateService } from './create.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';

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
    async get(@Query() round: any): Promise<any> {
        console.log(round)
        return this.createService.get(round)
    }

    @Get('/games')
    @UseGuards(AuthGuard())
    async getGame(@Request() req:any,@Query() dates: any): Promise<any> {
        const user = req.user; // Access the authenticated user from the request

        if (!user.isAdmin) {
          // Handle the scenario for admin users
          throw new UnauthorizedException('You are not an admin')
        }
        console.log()
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
        console.log(data);
        let { token } = data
        let isAdmin = await this.adminValidate.adminValidate(token)
        if (isAdmin) {
            return this.createService.update(data)
        }
        else {
            throw new UnauthorizedException(' You are not an admin')
        }
    }

    @Post('/update-reward-type')
    async updateRewardType(@Body() data: any) {
        console.log(data);
        let { token } = data
        let isAdmin = await this.adminValidate.adminValidate(token)
        if (isAdmin) {
            return this.createService.updateRewardType(data)
        }
        else {
            throw new UnauthorizedException(' You are not an admin')
        }
    }

}


