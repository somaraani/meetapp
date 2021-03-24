import io from "socket.io-client";
import {
  SocketEvents
} from '@types';
import config from "../config";
import jwtDecode from "jwt-decode";

const API_URL = config.API_URL;

export class SocketWrapper {
  private socket: SocketIOClient.Socket | null = null;
  private id: string = '';

  public connect(token: string): void {
    this.socket = io(API_URL, {
      transports: ['websocket'],
      upgrade: false,
      query: {token: token}
    });
    const decodedToken = jwtDecode<any>(token);
    this.id = decodedToken.id;
  }

  public disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
  public on(event: SocketEvents, fn: Function): SocketIOClient.Emitter {
    return this.socket?.on(event, fn) as SocketIOClient.Emitter;
  }

  public off(event: SocketEvents, fn?: Function): SocketIOClient.Emitter {
    return this.socket?.off(event, fn) as SocketIOClient.Emitter;
  }
  
  public join(room: string): SocketIOClient.Emitter {
    return this.socket?.emit(SocketEvents.JOIN, {room}) as SocketIOClient.Emitter;
  }
  
  public leave(room: string): SocketIOClient.Emitter {
    return this.socket?.emit(SocketEvents.LEAVE, {room}) as SocketIOClient.Emitter;
  }

  public updateLocation(data: any): SocketIOClient.Emitter {
    return this.socket?.emit(SocketEvents.LOCATION, data) as SocketIOClient.Emitter;
  }
}