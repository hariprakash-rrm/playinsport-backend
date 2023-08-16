import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectModel } from '@nestjs/mongoose';
import { Qr, QrCode } from './schema/schema';
import { Model } from 'mongoose';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
   ) { }

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Post('send-otp')
  sendMessage(@Body() data:any) {
    return this.appService.sendOTP(data.number, data.message)
  }

  @Get('qr')
  getQr(){
    return this.appService.qr()
  }


}
