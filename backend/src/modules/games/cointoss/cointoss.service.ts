import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/auth/schemas/user.schema';
import { PlayCoinTossDto } from './dto/cointoss.dto';
// import { PlayCoinTossSchemaResult } from './schemas/cointoss.schema';
import { PlayCoinTossDtoResult } from './dto/cointoss.dto';
import { error } from 'console';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
export class CointossService  {

    constructor(@InjectModel(User.name)
    private userModels: Model<User>,
    ) { }



    async play(details: PlayCoinTossDto, authToken): Promise<PlayCoinTossDtoResult> {
        const result = 1
        const { username, amount } = details

        const user = await this.userModels.findOne({ authToken })
        
        if (result == 1) {
            user.wallet -= amount*2
            if(user.wallet-amount <0){
                throw new NotAcceptableException('not enough balance')
            }
            user.save()
        }

        let users = user.username
        let userWallet = user.wallet
        return { username, userWallet }
    }
}

