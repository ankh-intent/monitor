import { CoreEvent } from '../../CoreEvent';
import { AbstractConsumer } from '../../AbstractConsumer';

import { StatEvent } from '../../events/StatEvent';
import { CoreOptions } from '../../../../Core';
import { CoreEventBus } from '../../CoreEventBus';
import { Logger } from '../../../../intent-utils/Logger';
import { LogStat } from './LogStat';

export class StatConsumer extends AbstractConsumer<StatEvent, any>{
  private readonly logger: Logger;
  private readonly processors: {
    log: LogStat;
  };

  public constructor(bus: CoreEventBus, options: CoreOptions, logger: Logger) {
    super(bus);
    this.logger = logger;
    this.processors = {
      log: new LogStat(options, this.logger),
    };
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === StatEvent.type();
  }

  public process(event: StatEvent) {
    let stat = event.data.stat;
    let processor = this.processors[stat.type];

    return (
      processor
        ? processor.process(event, stat)
        : event
    );
  }
}
