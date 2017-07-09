
import { Container } from '../../../../../intent-utils/Container';
import { Client as BaseClient } from '../../../../Client';

export class Client extends BaseClient {
  protected events(): Container<Function> {
    return {
      'nodes': this.nodes.bind(this),
    };
  }

  protected nodes() {
    return [
      {name: 'node.1'},
      {name: 'node.2'},
      {name: 'node.3'},
    ];
  }
}
