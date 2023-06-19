import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/auth/schemas/user.schema';
import { Game } from '../games/create/schemas/create.schema';
import { NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { error } from 'console';

@WebSocketGateway({ cors: { origin: ['http://localhost:4200'] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(@InjectModel(User.name)
  private userModels: Model<User>, @InjectModel(Game.name) private gameModels: Model<Game>
  ) { }
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.server.emit('users', Object.keys(this.server.sockets.sockets).length);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.server.emit('users', Object.keys(this.server.sockets.sockets).length);
  }

  

  @SubscribeMessage('getGame')
  async getGame( ) {
   
      let rounds: any = "2"
      let game = await this.gameModels.findOne({ round: rounds })
      this.server.emit('chat', game.totalToken);
   
   
  }
  @SubscribeMessage('chat')
  async handleMessage(client: Socket, data: any) {
    let { token, message } = data
    let response: any
    let user = await this.userModels.findOne(token.token)

    if (user) {
      let rounds: any = "2"
      let game = await this.gameModels.findOne({ round: rounds })
      if (game) {
        if (message == 'get') {
          response = game.totalToken
        }
        let findToken = await game.totalToken.includes(message)
        if (findToken) {
          let index = await game.totalToken.indexOf(message)
          game.totalToken.splice(index, 1)
          game.selected.push(message as number)
          
          await game.save()
          this.getGame()
          response={
            status:true,
            message:'Token selected ',
            statusCode:201
          }
        } else {
          response = {
            status: false,
            errorCode: 401,
            message: 'Slected number not available'
          }

          // throw new NotAcceptableException('Selected number not available')
        }
      } else {
        response = {
          status: false,
          errorCode: 401,
          message: 'Game not available'
        }

        // throw new NotAcceptableException('Game not found')
      }
      console.log(game)
    } else {
      response = {
        status: false,
        errorCode: 401,
        message: 'User not found'
      }

      // throw new UnauthorizedException('user not found')
    }
    console.log(`Message received: ${response}`);
    this.server.emit('chat', response);
  }
}
