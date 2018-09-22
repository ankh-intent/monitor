import { Container } from '../intent-utils/Container';

export interface ClientHub {
  event(client: Client, data): void;
  disconnect(client: Client): void;
}

export interface ClientFactory {
  (server: ClientHub, socket: any): Client;
}

export class Client {
  private readonly server: ClientHub;
  private socket: any;

  public constructor(server: ClientHub, socket, namespaces: string[] = []) {
    this.server = server;
    this.socket = namespaces.reduce((socket, namespace) => socket.to(namespace), socket)

    this.socket.on('disconnect', () => {
      this.server.disconnect(this);
    });

    let handlers = this.events();

    for (let name in handlers) {
      let handler = handlers[name];

      this.socket.on(name, handler.bind(this))
    }

    this.socket.on('srv-dispatch', this.server.event.bind(this.server, this));
  }

  protected events(): Container<Function> {
    return {

    };
  }

  public emit(...args) {
    this.socket.emit(...args);
  }

  public broadcast(...args) {
    this.socket.broadcast(...args);
  }
}
