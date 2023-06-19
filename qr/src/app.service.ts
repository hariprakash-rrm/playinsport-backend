import { Injectable } from '@nestjs/common';
import { Client, Message } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
@Injectable()
export class AppService {
  constructor(){
    this.client = new Client(
      {
          puppeteer: {
              args: ['--no-sandbox'],
          }
      }
  );
  this.client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
      console.log("QR generated, please scan from your whats app")
  });

  this.client.on('ready', () => {
      console.log("You have been scanned")
  })
  this.client.initialize();
  }
  private client: Client
  getHello() {

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

  
}
