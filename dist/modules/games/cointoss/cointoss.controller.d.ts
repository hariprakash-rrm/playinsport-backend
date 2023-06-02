import { PlayCoinTossDto } from './dto/cointoss.dto';
import { CointossService } from './cointoss.service';
export declare class CointossController {
    private cointossService;
    constructor(cointossService: CointossService);
    play(cointossdto: PlayCoinTossDto, authToken: string): Promise<import("./dto/cointoss.dto").PlayCoinTossDtoResult>;
}
