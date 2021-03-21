import io from "socket.io-client";
import {
  SocketEvents
} from '@types';
import config from "../config";
import jwtDecode from "jwt-decode";

const API_URL = config.API_URL;

export class SocketWrapper {
  private socket: SocketIOClient.Socket;
  private id: string;
  constructor(token: string) {
    this.socket = io(API_URL, {
        transports: ['websocket'],
        upgrade: false,
        query: {token: token}
      });
    const decodedToken = jwtDecode<any>(token);
    this.id = decodedToken.id;
  }
  public disconnect(): void {
    this.socket.disconnect();
  }
  public on(event: SocketEvents, fn: Function): SocketIOClient.Emitter {
    return this.socket.on(event, fn);
  }

  public off(event: SocketEvents, fn?: Function): SocketIOClient.Emitter {
    return this.socket.off(event, fn);
  }
  
  public join(room: string): SocketIOClient.Emitter {
    return this.socket.emit(SocketEvents.JOIN, {room});
  }
  
  public leave(room: string): SocketIOClient.Emitter {
    return this.socket.emit(SocketEvents.LEAVE, {room});
  }

  public updateLocation(data: any): SocketIOClient.Emitter {
    //TODO
    return this.socket.emit(SocketEvents.LOCATION, data);
  }
}