import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { SocketEvents } from '@types';
import { Server, Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private server: Server;
  private connections: { [userId: string]: Socket };
  private socketUserMap: { [socketId: string]: string };
  constructor() {
    this.connections = {};
    this.socketUserMap = {};
  }

  public addConnection(userId: string, socket: Socket) {
    this.connections[userId] = socket;
    this.socketUserMap[socket.id] = userId;
  }

  public setServer(server: Server) {
    this.server = server;
  }

  public removeConnection(socket: Socket) {
    const userId = this.socketUserMap[socket.id];
    delete this.connections[userId];
    delete this.socketUserMap[socket.id];
  }

  public emitToUser(userId: string, event: SocketEvents, message: any) {
    if (this.isConnected(userId)) {
      this.connections[userId].emit(event, message);
    }
  }

  public emitToRoom(roomId: string, event: SocketEvents, message?: any) {
    try {
      this.server.to(roomId).emit(event, message);
    } catch (e) {
      console.log('could not emit to room:' + roomId);
      console.log(e);
    }
  }

  public joinRoom(userId: string, roomId: string) {
    const userSocket = this.connections[userId];
    userSocket.join(roomId);
  }

  public leaveRoom(userId: string, roomId: string) {
    const userSocket = this.connections[userId];
    userSocket.leave(roomId);
  }

  public isConnected(userId: string): boolean {
    return this.connections[userId] ? true : false;
  }
}
