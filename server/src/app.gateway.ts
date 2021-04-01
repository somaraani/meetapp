import { Coordinate, SocketEvents, UpdateLocationRequest, UpdateLocationResponse } from '@types';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from './authentication/auth.service';
import { SocketService } from './socket/socket.service';
import { MeetingsService } from './models/meetings/meetings.service';
import { JourneysService } from './models/journeys/journeys.service';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit {
  constructor(
    private authService: AuthService,
    private socketService: SocketService,
    private meetingService: MeetingsService,
    private journeyService: JourneysService
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
  }

  handleDisconnect(client: Socket) {
    this.socketService.removeConnection(client);
  }

  @SubscribeMessage(SocketEvents.LOCATION)
  async handleMessage(client: Socket, request: any): Promise<void> { //how to get roomId, also can payload be coordinate?
    const {meetingId, location, userId} = request;
    const journey = await this.meetingService.updateLocation(userId, meetingId, location);
    const meeting = await this.meetingService.findById(meetingId);
    this.socketService.emitToRoom(meetingId, SocketEvents.MEETINGUPDATE, meeting);
    const locationResponse : UpdateLocationResponse = {
      location: journey.locations[journey.locations.length - 1],
      eta: journey.travelTime,
      journeyStatus: journey.status,
      userId: userId
    }
    this.socketService.emitToRoom(meetingId, SocketEvents.LOCATION, locationResponse);
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
