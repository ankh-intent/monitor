
import { OptionsResolver } from './OptionsResolver';

import { Emitter } from './intent-utils/Emitter';
import { Logger } from './intent-utils/Logger';

import { CoreEventBus } from './core/flow/CoreEventBus';
import { CoreEvent } from './core/flow/CoreEvent';
import { FatalEvent } from './core/flow/events/FatalEvent';

import { StatConsumer } from './core/flow/consumers/stat/StatConsumer';
import { ErrorConsumer } from './core/flow/consumers/ErrorConsumer';
import { EventChainMonitor } from './core/flow/consumers/EventChainMonitor';
import { IntentLogger } from './core/IntentLogger';
import { DependencyManager } from './core/dependencies/DependencyManager';
import { IntentServer } from './IntentServer';
import { ServerOptions } from './core/ServerOptions';

export interface EmitOptions {
  stats: boolean
  options: boolean;
}

export interface CoreOptions {
  emit: EmitOptions;
  server?: ServerOptions;
}

export class Core extends Emitter<(event: CoreEvent<any>) => any> {
  private options: OptionsResolver;
  private events: CoreEventBus;

  private eventChainMonitor: EventChainMonitor<CoreEvent<any>>;
  private dependencyTree: DependencyManager;

  public logger: Logger;
  private server: IntentServer;

  public constructor() {
    super();
    this.logger = new IntentLogger();
    this.options= new OptionsResolver();
    this.events = new CoreEventBus();
  }

  public bootstrap(options: CoreOptions): CoreOptions {
    this.eventChainMonitor = new EventChainMonitor(this.events);
    this.dependencyTree = new DependencyManager();
    let resolved = this.options.resolve(options);

    if (resolved.server) {
      this.server = new IntentServer(this.dependencyTree, resolved.server);
    }

    this.events
      .add(this.eventChainMonitor)
      .add(new ErrorConsumer(this.events, this.logger))
      .add(new StatConsumer(this.events, resolved, this.logger))
      .add(this.eventChainMonitor)
    ;

    return resolved;
  }

  public start(options: CoreOptions): this {
    if (this.server) {
      this.server.on(IntentServer.READY, () => {
        this.events.stat({
          type: 'ready',
        })
      });
      this.server.start();
    }

    // this.eventChainMonitor
    //   .monitor(updates)
    //   .once((data: EventChainMonitoringData) => {
    //     this.events.emit(new ReadyEvent(data))
    //   })
    // ;

    this.events
      .add({
        consume: (event) => {
          if (event instanceof FatalEvent) {
            this.stop();
          }

          this.emit(event);
        }
      })
    ;

    // for (let update of updates) {
    //   this.events.emit(update);
    // }
    //
    return this;
  }

  public stop() {
    if (this.server) {
      this.server.stop();
    }
  }
}

