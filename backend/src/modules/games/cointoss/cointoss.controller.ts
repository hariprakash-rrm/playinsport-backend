import { Body, Controller, Headers, Post } from '@nestjs/common';
import { PlayCoinTossDto } from './dto/cointoss.dto';
// import { PlayCoinTossSchemaResult } from './schemas/cointoss.schema';
// import { PlayCoinTossDtoResult } from './dto/cointoss.dto';
import { CointossService } from './cointoss.service';

@Controller('')
export class CointossController  {
constructor(private cointossService:CointossService)
{}
    @Post('/play')
    play(@Body()cointossdto:PlayCoinTossDto ,@Headers('Authorization') authToken: string){
        console.log(authToken)
       return this.cointossService.play(cointossdto,authToken)
    }
}
