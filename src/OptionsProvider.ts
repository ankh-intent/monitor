
import { AbstractOptionsProvider } from './intent-app/AbstractOptionsProvider';
import { Core, CoreOptions, EmitOptions } from './Core';
import { ServerOptions } from './core/ServerOptions';

export class OptionsProvider extends AbstractOptionsProvider<CoreOptions> {
  private _defaults: CoreOptions;

  public constructor(defaults: CoreOptions) {
    super();
    this._defaults = defaults;
  }

  protected usage(): string {
    const pckg = require("../package.json");

    return `intent ${pckg.version}\n` +
      `${pckg.description}\n` +
      `Usage: intent [<options>] [<entry>]`
    ;
  }

  protected options(defaults: CoreOptions): any {
    return {
      "Basic options": {
        "server-port": {
          "type": "number",
          "describe": "Port to listen for connection on",
          "default": defaults.server.port,
          "requiresArg": true,
        },
      },
      "Emit options": {
        "output-emit-stats": {
          "type": "boolean",
          "describe": "Emit compilation stat event to console output",
          "default": defaults.emit.stats,
          "requiresArg": false,
        },
        "output-emit-options": {
          "type": "boolean",
          "describe": "Emit to console the options, reconciled form command-line",
          "default": defaults.emit.options,
          "requiresArg": false,
        },
      },
    };
  }

  protected emit(defaults: CoreOptions): EmitOptions {
    return {
      stats: this.get("output-emit-stats"),
      options: this.get("output-emit-options"),
    };
  }

  protected server(defaults: CoreOptions): ServerOptions {
    return {
      port: this.get("server-port"),
      web: {
        root: defaults.server.web.root,
      },
    };
  }

  public build(core: Core): CoreOptions {
    let defaults = this.defaults();

    return <CoreOptions> {
      emit: this.emit(defaults),
      server: this.server(defaults),
    };
  }

  protected defaults(): CoreOptions {
    return this._defaults;
  }
}
