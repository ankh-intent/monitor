
import { CoreEvent } from '../CoreEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { CoreEventBus } from '../CoreEventBus';
import { Emitter } from '../../../intent-utils/Emitter';
import { FatalEvent } from '../events/FatalEvent';
import { StoppedEvent } from '../events/StoppedEvent';

export class EmitterConsumer extends AbstractConsumer<CoreEvent<any>, any> {
  private emitter: Emitter<any>;

  public constructor(bus: CoreEventBus, emitter: Emitter<any>) {
    super(bus);
    this.emitter = emitter;
  }

  public supports(event: CoreEvent<any>): boolean {
    return true;
  }

  public process(event: CoreEvent<any>) {
    if (event instanceof FatalEvent) {
      return new StoppedEvent({});
    }

    this.emitter.emit(event);
  }
}
