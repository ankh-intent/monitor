
import * as index from 'serve-index';

import { RoutesCollection as BaseRoutesCollection } from '../../../../RoutesCollection';
import { ServerOptions } from '../../../../ServerOptions';

export class RoutesCollection extends BaseRoutesCollection<ServerOptions> {
  public configure(app, options: ServerOptions) {
    super.configure(app, options);

    app.use('/static', index(options.web.root, {}));
  }
}
