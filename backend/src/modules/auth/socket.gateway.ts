import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/auth/schemas/user.schema';

@WebSocketGateway({ cors: { origin: ['http://localhost:4200'] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(@InjectModel(User.name)
  private userModels: Model<User>,
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

  @SubscribeMessage('chat')
  async handleMessage(client: Socket, data: any) {
    let { token, message } = data
    let user =await this.userModels.findOne(token.token)
    user.username = message
    user.save()
    console.log(`Message received: ${message}`);
    this.server.emit('chat', message);
  }
}
