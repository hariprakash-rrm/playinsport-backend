import { Injectable } from '@nestjs/common';
import { Client, Message } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
@Injectable()
export class AppService {
  private client:Client
  constructor(){
 

  }
  getHello(): string {
    return 'Hello World!';
  }
}
