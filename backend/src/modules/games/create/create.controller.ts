import { Body, Controller, Post } from '@nestjs/common';
import { createTokenDto, refundDto } from './dto/createToken.dto';
import { CreateService } from './create.service';

@Controller('token')
export class CreateController {
    constructor(private createService: CreateService) { }

    @Post('/create')
    async create(@Body() createTokenDto: createTokenDto): Promise<any> {
        return this.createService.create(createTokenDto)

    }

    @Post('/refund')
    async refund(@Body()refundDto:refundDto){
        return this.createService.refund(refundDto)
    }


}
