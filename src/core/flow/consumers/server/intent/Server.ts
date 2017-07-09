
import { Server as BaseServer } from '../../../../Server';
import { ServerOptions } from '../../../../ServerOptions';

import { RoutesCollection } from './RoutesCollection';
import { Client } from './Client';

export class Server extends BaseServer<ServerOptions> {
  public constructor(options: ServerOptions) {
    super(
      (server, socket) => new Client(server, socket),
      new RoutesCollection(),
      options
    );
  }
}

