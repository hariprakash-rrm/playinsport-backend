import { Module } from '@nestjs/common';
import { CreateController } from './create.controller';
import { CreateService } from './create.service';
import { Game, GameSchema } from './schemas/create.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports:[MongooseModule.forFeature([{ name: 'Game', schema: GameSchema }])],
  controllers: [CreateController],
  providers: [CreateService]
})
export class CreateModule {}
