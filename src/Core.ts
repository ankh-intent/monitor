import { OptionsResolver } from './OptionsResolver';

import { Emitter } from './intent-utils/Emitter';
import { Logger } from './intent-utils/Logger';

import { CoreEventBus } from './core/flow/CoreEventBus';
import { CoreEvent, CoreEventConsumer } from './core/flow/CoreEvent';

import { StatConsumer } from './core/flow/consumers/stat/StatConsumer';
import { ErrorConsumer } from './core/flow/consumers/ErrorConsumer';
import { EventChainMonitor, EventChainMonitoringData } from './core/flow/consumers/EventChainMonitor';
import { IntentLogger } from './core/IntentLogger';
import { ServerOptions } from './core/ServerOptions';
import { ServerConsumer } from './core/flow/consumers/server/ServerConsumer';
import { ReadyEvent } from './core/flow/events/ReadyEvent';
import { StartedEvent } from './core/flow/events/StartedEvent';
import { StoppedEvent } from './core/flow/events/StoppedEvent';
import { EmitterConsumer } from './core/flow/consumers/EmitterConsumer';

export interface EmitOptions {
  stats: boolean
  options: boolean;
}

export interface CoreOptions {
  emit: EmitOptions;
  server?: ServerOptions;
}

export class Core extends Emitter<(event: CoreEvent<any>) => any> {
  public logger: Logger;

  private options: OptionsResolver;
  private events: CoreEventBus;
  private monitor: EventChainMonitor<CoreEvent<any>>;

  public constructor() {
    super();
    this.logger = new IntentLogger();
    this.options = new OptionsResolver();
    this.events = new CoreEventBus();
    this.monitor = new EventChainMonitor(this.events);
  }

  public bootstrap(options: CoreOptions): CoreOptions {
    let resolved = this.options.resolve(options);

    this.events
      .add(this.monitor)
      .add(this.configureCommandChain(this.events, resolved))
      .add(new ErrorConsumer(this.events, this.logger))
      .add(new StatConsumer(this.events, resolved, this.logger))
      .add(this.monitor)
      .add(new EmitterConsumer(this.events, this))
    ;

    return resolved;
  }

  public start(options: CoreOptions): this {
    let event = this.initiated(options);

    this.monitor
      .monitor([event])
      .once((data: EventChainMonitoringData) => {
        this.events.emit(new ReadyEvent(data, event));
      })
    ;

    this.events.emit(event);

    return this;
  }

  protected configureCommandChain(bus: CoreEventBus, options: CoreOptions): CoreEventConsumer<any, any>[] {
    return [
      new ServerConsumer(bus, options.server, this.logger),
    ];
  }

  protected initiated(options: CoreOptions): CoreEvent<any> {
    return new StartedEvent({
      options,
    });
  }

  public stop() {
    this.events.emit(new StoppedEvent({}));
  }
}

