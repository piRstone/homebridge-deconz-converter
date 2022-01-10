import { EventEmitter } from 'stream';
import WebSocket from 'ws';

type WSConfig = {
  host: string;
  port: string;
};

export default class WSClient extends EventEmitter {
  config: WSConfig;

  constructor(private readonly host: string, private readonly port: string) {
    super();
    this.config = { host, port };
  }

  connect(): WebSocket {
    return new WebSocket(`ws://${this.host}:${this.port}`);
  }
}
