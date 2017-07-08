
import { CoreOptions } from './Core';

export class OptionsResolver {
  public resolve(options: CoreOptions): CoreOptions {
    return Object.assign({}, options);
  }
}
