
import * as express from 'express';
import * as index from 'serve-index';

import { ServerOptions } from './core/ServerOptions';
import { Server } from './core/Server';
import { RoutesCollection } from './core/RoutesCollection';
import { DependencyManager } from './core/dependencies/DependencyManager';
import { DependencyNode } from './core/dependencies/DependencyNode';
import { Client, ClientHub } from './core/Client';
import { Container } from './intent-utils/Container';

export class IntentServer extends Server<ServerOptions> {
  public constructor(tree: DependencyManager, options: ServerOptions) {
    super(
      (server: ClientHub, socket: any) => (<IntentServer>server).clientFactory(socket),
      new IntentRoutesCollection(tree),
      options
    );
  }

  protected clientFactory(socket: any): Client {
    return new IntentClient(this, socket);
  }
}

class IntentClient extends Client {
  protected events(): Container<Function> {
    return {
      'nodes': this.nodes.bind(this),
    };
  }

  protected nodes() {
    return [
      {name:'node.1'},
      {name:'node.2'},
      {name:'node.3'},
    ];
  }
}

class IntentRoutesCollection extends RoutesCollection<ServerOptions> {
  private tree: DependencyManager;

  public constructor(tree: DependencyManager) {
    super();
    this.tree = tree;
  }

  public configure(app, options: ServerOptions) {
    super.configure(app, options);

    app.use('/static', index(options.web.root, {
    }));

    app.use('/nodes', this.nodes());
  }

  protected nodes() {
    return express.Router()
      .get('/', (req, res) => {

        res.status(200).json(
          this.tree
            .all()
            .map((dep: DependencyNode) => {
              return {
                name: dep.dependency.identifier,
                relations: dep.relations().map((dep) => dep.dependency.identifier),
              };
            })
        );
      })
      .get('/:node', (req, res) => {
        res.status(200).json({
          name: req.node.dependency.name,
          relations: req.node.relations().map((dep) => dep.dependency.identifier),
        });
      })
      .param('node', (req, res, next, identifier) => {
        let node = this.tree.contains((node: DependencyNode) => {
          return node.dependency.identifier === identifier;
        });

        if (node) {
          req.node = node;

          next();
        } else {
          next(new Error(`Dependency node "${identifier}" not found`));
        }
      })
    ;

  }
}
