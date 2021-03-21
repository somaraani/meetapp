import { SocketEvents } from '@types';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from './authentication/auth.service';
import { SocketService } from './socket/socket.service';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit {
  constructor(
    private authService: AuthService,
    private socketService: SocketService
  ) { }

  afterInit(server: Server){
    this.socketService.setServer(server);
  }

  handleConnection(client: Socket) {
    const token = client.handshake.query.token;
    const tokenData = this.authService.verifyJwt(token);
    if (!tokenData) {
      client.disconnect(true);
      return;
    }
    this.socketService.addConnection(tokenData.id, client);
    console.log(`socket ${client.id} connected`);

    this.socketService.joinRoom(tokenData.id, 'meetingId');
  }

  handleDisconnect(client: Socket) {
    console.log(`socket ${client.id} disconnected`);
    this.socketService.removeConnection(client);
  }

  @SubscribeMessage(SocketEvents.LOCATION)
  handleMessage(client: Socket, payload: string): void {
    console.log("sent message")

    this.socketService.emitToRoom('meetingId', 'location', "User location updated");
    //can send to service here
   }
   
}
