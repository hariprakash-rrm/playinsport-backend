import { Model } from 'mongoose';
import { User } from 'src/modules/auth/schemas/user.schema';
import { PlayCoinTossDto } from './dto/cointoss.dto';
import { PlayCoinTossDtoResult } from './dto/cointoss.dto';
export declare class CointossService {
    private userModels;
    constructor(userModels: Model<User>);
    play(details: PlayCoinTossDto, authToken: any): Promise<PlayCoinTossDtoResult>;
}
