import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/auth/schemas/user.schema';
import { Game } from '../schemas/create.schema';

import axios from 'axios';

@WebSocketGateway({ cors: { origin: ['http://localhost:4200'] } })
export class GameGateWay implements OnGatewayConnection, OnGatewayDisconnect {
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
  async getGame() {

    let rounds: any = "1"
    let game = await this.gameModels.findOne({ round: rounds })

    this.server.emit('getGame', game.tokenDetails);


  }
  @SubscribeMessage('isError')
  async isError(data: any,userId) {
    const targetClient = this.server.sockets.sockets.get(userId);
    if (targetClient) {
      targetClient.emit('isError', data);
    } else {
      console.log(`Target client with ID ${userId} not found`);
    }


  }
  @SubscribeMessage('chat')
  async handleMessage(client: Socket, data: any) {
    let { token, index, tokenNumber,id } = data
    let response: any
    let user = await this.userModels.findOne({ token: token })
    console.log(user)
    if (user) {
      let rounds: any = 1
      let game = await this.gameModels.findOne({ round: rounds })
      if (game) {
        this.server.emit('chat', user)
        let arr: any = await game.tokenDetails[index]

        if (!arr.isSelected) {
          try {
            let data = {
              tokenNumber: tokenNumber,
              selectedBy: user.username,
              isSelected: true,
              number: user.number
            }
            game.tokenDetails[index] = data
            let postData = {
              number: user.number,
              message: `Details :\n
              Rounds : ${rounds}\n
              Selected number : ${tokenNumber}`
            }
            const response = await axios.post('http://localhost:3001/send-otp', postData).then((res: any) => {
              // console.log(res)
              data = res

            })
            await game.save()
            this.getGame()
          } catch (err) {
            response = {
              status: false,
              errorCode: 401,
              message: 'Something went wrong'
            }
            this.isError(response,id)

          }

        }
        else {
          response = {
            status: false,
            errorCode: 401,
            message: 'Token already selected',
            
          }
          this.isError(response,id)
        }

      } else {
        response = {
          status: false,
          errorCode: 401,
          message: 'Game not available'
        }
        this.isError(response,id)

      }


    } else {
      response = {
        status: false,
        errorCode: 401,
        message: 'User not found'
      }
      this.isError(response,id)
    }
   
  }
}