
import * as path from 'path';

import { CoreOptions } from '../Core';

const options: CoreOptions = {
  emit: {
    stats: false,
    options: false,
  },
  server: {
    port: 3000,
    web: {
      root: path.resolve(path.join(__dirname, '../src/core/application/web/'))
    },
  },
};

export default options;
