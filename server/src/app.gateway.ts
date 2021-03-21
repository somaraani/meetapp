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

  afterInit(server: Server) {
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
  updateLocation(client: Socket, payload: string): void {
    console.log("sent message")
    //todo
    this.socketService.emitToRoom('meetingId', SocketEvents.LOCATION, "User location updated");
    //can send to service here
  }

  @SubscribeMessage(SocketEvents.JOIN)
  joinRoom(client: Socket, data: { room: string }): void {
    client.join(data.room);
  }

  @SubscribeMessage(SocketEvents.LEAVE)
  leaveRoom(client: Socket, data: { room: string }): void {
    client.leave(data.room);
  }
}
