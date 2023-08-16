import { Injectable } from '@nestjs/common';
import { Client, Message } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
@Injectable()
export class AppService {
  private client:Client
  newCode:any
  constructor(){
    this.client = new Client(
      {
          puppeteer: {
              args: ['--no-sandbox'],
          }
      }
  );
  this.client.on('qr', (_qrCode) => {
    console.log(typeof(_qrCode))
      qrcode.generate(_qrCode, { small: true });
      console.log("QR generated, please scan from your whats app")
      // this.setQr(_qrCode)
  });

  this.client.on('ready', () => {
      console.log("You have been scanned")
  })

  
  
  this.client.initialize();

  }
  getHello(): string {
    return 'Hello World!';
  }  

  sendOTP(number:number,message:any){
    console.log(number,message)
    try {
      this.client.sendMessage(`91${number}@c.us`, `${message} `)
          .then((result) => { return result })

  } catch (error) {
      return error
  }
  }

  qr(){
    return this.newCode
  }
}
