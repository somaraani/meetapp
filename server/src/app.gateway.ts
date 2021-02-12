import { UseFilters, UseGuards } from '@nestjs/common';
import { BaseWsExceptionFilter, SubscribeMessage, WebSocketGateway, WsException } from '@nestjs/websockets';
import { exception } from 'console';
import { listen, Socket } from 'socket.io';
import { AuthService } from './authentication/auth.service';

@WebSocketGateway()
export class AppGateway {
  constructor(
    private authService: AuthService,
) { }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  handleConnection(client: Socket) {
    const token = client.handshake.query.token;
    const tokenData = this.authService.verifyJwt(token);
    if (!tokenData){
      client.disconnect(true);
      return;
    }
    console.log('conn');
    
  }

  handleDisconnect(client: Socket) {
    console.log('dc');
  }
}
