
import { CoreEvent, CoreEventConsumer } from './CoreEvent';
import { StatEvent } from './events/StatEvent';

export class CoreEventBus<T = any, E extends CoreEvent<T> = CoreEvent<T>, C extends CoreEventConsumer<T, E> = CoreEventConsumer<T, E>> {
  private consumers: C[] = [];

  public add(consumer: C|C[]): this {
    if (consumer instanceof Array) {
      for (let c of consumer) {
        this.add(c);
      }
    } else {
      this.consumers.push(consumer);
    }

    return this;
  }

  public off(consumer: C): number {
    let index, n = 0;

    while ((index = this.consumers.indexOf(consumer)) >= 0) {
      delete this.consumers[index];
      n++;
    }

    return n;
  }

  public emit(event: CoreEvent<any>): CoreEvent<any> {
    for (let consumer of this.consumers) {
      if (!consumer.supports(event)) {
        continue;
      }

      let processed = consumer.consume(<any>event);

      if (event === processed) {
        if (!event.bubble) {
          break;
        }

        continue;
      }

      if (!processed) {
        break;
      }

      if (processed.bubble) {
        if (!processed.parent) {
          processed.parent = event;
        }

        event = this.emit(processed);
      }

      break;
    }

    return event;
  }

  public stat(data: any, parent?: CoreEvent<any>): CoreEvent<any> {
    return this.emit(new StatEvent({
      stat: data,
    }, parent));
  }
}
