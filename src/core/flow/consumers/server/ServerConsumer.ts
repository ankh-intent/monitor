import { ReadyEvent } from '../../events/ReadyEvent';
import { AbstractConsumer } from '../../AbstractConsumer';
import { Logger } from '../../../../intent-utils/Logger';
import { CoreEventBus } from '../../CoreEventBus';
import { CoreEvent } from '../../CoreEvent';

import { StoppedEvent } from '../../events/StoppedEvent';
import { StartedEvent } from '../../events/StartedEvent';

import { Server } from './intent/Server';
import { ServerOptions } from '../../../ServerOptions';

export class ServerConsumer extends AbstractConsumer<ReadyEvent|StoppedEvent, any>{
  private options: ServerOptions;
  private server: Server;
  private logger: Logger;

  public constructor(bus: CoreEventBus<any, ReadyEvent|StoppedEvent>, options: ServerOptions, logger: Logger) {
    super(bus);
    this.options = options;
    this.logger = logger;
  }

  public supports(event: CoreEvent<any>): boolean {
    switch (event.type) {
      case ReadyEvent.type():
      case StoppedEvent.type():
        return true;
    }

    return false;
  }

  public process(event: ReadyEvent|StoppedEvent) {
    if (event instanceof ReadyEvent) {
      if (this.server) {
        return;
      }

      let { data: { options } } = event.lookup(StartedEvent.type());
      this.server = new Server(options.server);

      this.server.on(Server.READY, () => {
        this.stat(event, {
          type: 'server',
          state: 'ready',
        });
      });
      this.server.on(Server.SHUTDOWN, () => {
        this.stat(event, {
          type: 'server',
          state: 'stopped',
        });
      });

      this.server.start();
    } else {
      if (this.server) {
        this.server.stop();
        this.server = null;
      }
    }
  }
}
