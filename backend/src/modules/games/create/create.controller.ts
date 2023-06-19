import { Body, Controller, Post } from '@nestjs/common';
import { createTokenDto } from './dto/createToken.dto';
import { CreateService } from './create.service';

@Controller('token')
export class CreateController {
    constructor(private createService: CreateService) { }

    @Post('/create')
    async create(@Body() createTokenDto: createTokenDto): Promise<any> {
        return this.createService.create(createTokenDto)

    }


}
