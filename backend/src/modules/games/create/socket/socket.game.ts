import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/auth/schemas/user.schema';
import { Game, GameDetails } from '../schemas/create.schema';

import axios from 'axios';
import { env } from 'process';
import { AuthService } from 'src/modules/auth/auth.service';
require("dotenv").config();

@WebSocketGateway({ cors: { origin: ['http://teamquantum.in','http://www.teamquantum.in'] } })
export class GameGateWay implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private authService:AuthService,@InjectModel(User.name)
  private userModels: Model<User>, @InjectModel(Game.name) private gameModels: Model<Game>, @InjectModel(GameDetails.name) private gameDeatilsModel: Model<GameDetails>
  ) { }
  round: number = 1
  index: any = 0
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    const currentDate = new Date();
    const isoDate = currentDate.toISOString();

    console.log(isoDate);
    this.server.emit('users', Object.keys(this.server.sockets.sockets).length);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.server.emit('users', Object.keys(this.server.sockets.sockets).length);
  }



  @SubscribeMessage('getGame')
  async getGame() {
    let rounds: any = this.round
    let games: any = await this.gameModels.findOne({ round: rounds })
    this.server.emit('getGame', games.tokenDetails[this.index]);
  }

  @SubscribeMessage('isError')
  async isError(data: any, userId) {
    const targetClient = this.server.sockets.sockets.get(userId);
    if (targetClient) {
      targetClient.emit('isError', data);
    } else {
      console.log(`Target client with ID ${userId} not found`);
    }

  }

  @SubscribeMessage('userBalance')
  async userBalance(client: Socket, data: any) {
    let { token, userId } = data
    let user: any = await this.userModels.findOne({ token: token })
    const targetClient = this.server.sockets.sockets.get(userId);
    if (targetClient) {
      targetClient.emit('userBalance', user.wallet);
    } else {
      console.log(`Target client with ID ${userId} not found`);
    }

  }

  @SubscribeMessage('game')
  async game(client: Socket, round: number) {
    let rounds: any = round
    let games: any = await this.gameModels.findOne({ round: rounds })
    this.server.emit('game', games.tokenDetails);
  }


  @SubscribeMessage('chat')
  async handleMessage(client: Socket, data: any) {
    const timestamp = new Date().getTime();
    let { round, token, index, tokenNumber, id } = data
    let response: any
    let user = await this.userModels.findOne({ token: token })
    if (user) {

      let game = await this.gameModels.findOne({ round: round })

      console.log();

      let totalTokenForUser:any = 0;
      let tokenDetails = game.tokenDetails;

      tokenDetails.forEach((element : any)=> {
        if (user.username === element.selectedBy) {
          totalTokenForUser += 1;
        }
      });

      if (totalTokenForUser >= game.maximumTokenPerUser) {
        response = {
          status: false,
          errorCode: 401,
          message: `Error : Maximum token per user is ${game.maximumTokenPerUser} for this round`,

        }
        this.isError(response, id)
        return
      }

      if (game) {
        if (game.isComplete) {
          response = {
            status: false,
            errorCode: 401,
            message: 'Error : Round completed',

          }
          this.isError(response, id)
          return
        }

        this.server.emit('chat', user)
        let arr: any = await game.tokenDetails[index]
        this.round = round

        if ((+user.reward + +user.wallet) >= +game.tokenPrice) {
          if (!arr.isSelected) {

            try {
              this.index = index
              let data = {
                tokenNumber: tokenNumber,
                selectedBy: user.username,
                isSelected: true,
                number: user.number,
                round: round,
                time: timestamp
              }
              game.tokenDetails[index] = data
              let postData = {
                number: user.number,
                message: `Details :\n
              Rounds : ${round}\n
              Selected number : ${tokenNumber}`
              }
              try{
              const response = await this.authService.sendMessage(postData)
            }catch{
              console.log('message error-whatsapp')
            }
            if((+user.reward - game.tokenPrice) <=0){
              let deductwallet =  +game.tokenPrice - +user.reward 
              user.reward=0
              user.wallet -= deductwallet
            }else{
              user.reward -= game.tokenPrice
            }
              // user.wallet -= +game.tokenPrice
              let txnHistory: any = {
                message: `Token Paricipation- round:${round}  Token ${tokenNumber}`,
                amount: -game.tokenPrice,
                time: timestamp,
                newBalance: user.wallet
              }
              user.txnHistory.push(txnHistory)
              await game.save();

              await user.save()
              // await this.userBalance(Socket,token,id)
              await this.getGame()
              // this.round = round
            } catch (err) {
              response = {
                status: false,
                errorCode: 401,
                message: 'Something went wrong'
              }
              this.isError(response, id)

            }

          }
          else {
            response = {
              status: false,
              errorCode: 401,
              message: 'Token already selected',

            }
            this.isError(response, id)
          }
        }
        else {
          response = {
            status: false,
            errorCode: 401,
            message: 'Low balance , please deposit',
          }
          this.isError(response, id)
        }

      } else {
        response = {
          status: false,
          errorCode: 401,
          message: 'Game not available'
        }
        this.isError(response, id)

      }


    } else {
      response = {
        status: false,
        errorCode: 401,
        message: 'User not found'
      }
      this.isError(response, id)
    }

  }
}