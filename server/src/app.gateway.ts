import { UseFilters, UseGuards } from '@nestjs/common';
import { BaseWsExceptionFilter, SubscribeMessage, WebSocketGateway, WsException } from '@nestjs/websockets';
import { exception } from 'console';
import { listen, Socket } from 'socket.io';
import { AuthService } from './authentication/auth.service';
import { SocketService } from './socket/socket.service';

@WebSocketGateway()
export class AppGateway {
  constructor(
    private authService: AuthService,
    private socketService: SocketService,
  ) { }

  handleConnection(client: Socket) {
    const token = client.handshake.query.token;
    const tokenData = this.authService.verifyJwt(token);
    if (!tokenData) {
      client.disconnect(true);
      return;
    }
    this.socketService.addConnection(tokenData.id, client);
    console.log(`socket ${client.id} connected`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }

  handleDisconnect(client: Socket) {
    console.log(`socket ${client.id} disconnected`);
    this.socketService.removeConnection(client);
  }
}
