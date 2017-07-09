
import { CoreEvent, CoreEventConsumer } from './CoreEvent';
import { ErrorEvent } from './events/ErrorEvent';
import { CoreEventBus } from './CoreEventBus';

export abstract class AbstractConsumer<E extends CoreEvent<T>, T> implements CoreEventConsumer<T, E> {
  private bus: CoreEventBus<T, E>;

  public abstract supports(event: CoreEvent<any>): boolean;
  public abstract process(event: E): CoreEvent<any>|void;

  public constructor(bus: CoreEventBus<T, E>) {
    this.bus = bus;
  }

  public detach(): boolean {
    return !!this.bus.off(this);
  }

  public consume(event: E): CoreEvent<any>|void {
    try {
      return this.process(event);
    } catch (error) {
      return new ErrorEvent({
        error,
      });
    }
  }

  public emit(event: CoreEvent<any>, propagated: boolean = null): CoreEvent<any> {
    if (propagated !== null) {
      event.stopPropagation(!propagated);
    }

    return this.bus.emit(event);
  }

  public stat(parent: CoreEvent<any>, data: any): CoreEvent<any> {
    return this.bus.stat(data, parent);
  }
}
