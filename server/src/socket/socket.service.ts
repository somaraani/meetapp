import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { setInterval } from 'timers';

@Injectable()
export class SocketService {
    private connections :   { [userId: string] : Socket }
    private socketUserMap : { [socketId: string] : string}
    constructor(){
        this.connections = {};
        this.socketUserMap = {};
    }

    public addConnection(userId : string, socket: Socket){
        this.connections[userId] = socket;
        this.socketUserMap[socket.id] = userId;
    }

    public removeConnection(socket: Socket){
        const userId = this.socketUserMap[socket.id];
        delete this.connections[userId]
        delete this.socketUserMap[socket.id];
    }

    public emit(userId:string, event:string, message: any) {
        this.connections[userId].emit(event, message);
    }

    public joinRoom(userId:string, roomId: string) {
        const userSocket = this.connections[userId];
        userSocket.join(roomId);
    }
    
    public leaveRoom(userId:string, roomId: string) {
        const userSocket = this.connections[userId];
        userSocket.leave(roomId);
    }
}
