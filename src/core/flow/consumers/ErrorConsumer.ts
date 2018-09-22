import { Logger } from '../../../intent-utils/Logger';
import { CoreEvent } from '../CoreEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { ErrorEvent } from '../events/ErrorEvent';
import { CoreEventBus } from '../CoreEventBus';
import { StatEvent } from '../events/StatEvent';

export class ErrorConsumer extends AbstractConsumer<ErrorEvent, any>{
  private logger: Logger;

  public constructor(bus: CoreEventBus, logger: Logger) {
    super(bus);
    this.logger = logger;
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === ErrorEvent.type();
  }

  public process(event: ErrorEvent) {
    let parent: CoreEvent<any> = event;

    while (parent) {
      let { type, data } = parent;
      parent = parent.parent;

      if (type === ErrorEvent.type()) {
        this.report(data.error);
      } else {
        this.logger.log(Logger.ERROR, ' caused by:', type, (<any>data).path ? `(${(<any>data).path})` : '');
      }
    }

    return new StatEvent({
      parent: event,
      stat: {
        type: 'error',
        error: this.describeError(event.data.error).join("\n"),
      },
    });
  }

  protected report(error) {
    this.logger.log(Logger.ERROR, ...this.describeError(error));
  }

  private describeError(error: Error) {
    let stack = error.stack.split("\n");
    let msg = stack.shift().toString();

    return [msg, "\n", stack.join("\n")];
  }
}
