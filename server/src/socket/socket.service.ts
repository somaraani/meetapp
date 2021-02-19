import { Injectable } from '@nestjs/common';
import { connect } from 'http2';
import { Socket } from 'socket.io';
import { setInterval } from 'timers';

@Injectable()
export class SocketService {
    private connections :   { [userId: string] : Socket[] }
    private socketUserMap : { [socketId: string] : string}
    constructor(){
        this.connections = {};
        this.socketUserMap = {};

        setInterval(() => {
            console.log('Socket Connections:');
            console.log(this.connections);
            console.log(this.socketUserMap);
        }, 5000);
    }

    public addConnection(userId : string, socket: Socket){
        if (!this.connections[userId]){
            this.connections[userId] = []
        }
        this.connections[userId].push(socket);
        this.socketUserMap[socket.id] = userId;
    }

    public removeConnection(socket: Socket){
        const userId = this.socketUserMap[socket.id];
        const userConnections = this.connections[userId];
        userConnections.splice(userConnections.indexOf(socket));
        if (userConnections.length == 0){
            delete this.connections[userId]
        }
        delete this.socketUserMap[socket.id];
    }

    public emit(userId:string, event:string, message: any) {
        this.connections[userId].forEach(element => {
            element.emit(event, message);
        });
    }

    public join(userId:string, event:string, message: any) {
        this.connections[userId].forEach(element => {
        });
    }

    
}
