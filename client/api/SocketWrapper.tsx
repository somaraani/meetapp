import io from "socket.io-client";
import {
  SocketEvents
} from '@types';
import config from "../config";

const API_URL = config.API_URL;

export class SocketWrapper {
  private socket: SocketIOClient.Socket;
  constructor(token: string) {
    this.socket = io(API_URL, {
        transports: ['websocket'],
        upgrade: false,
        query: {token: token}
      });
  }
  public disconnect(): void {
    this.socket.disconnect();
  }
  public on(event: SocketEvents, fn: Function): SocketIOClient.Emitter {
    return this.socket.on(event, fn);
  }

  public off(event: SocketEvents, fn: Function): SocketIOClient.Emitter {
    return this.socket.off(event, fn);
  }
  
  public updateLocation(data: any): SocketIOClient.Emitter {
    //todo
    return this.socket.emit(SocketEvents.LOCATION, data);
  }
}