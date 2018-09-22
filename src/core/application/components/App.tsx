
import * as React from 'react';
import * as io from 'socket.io-client';
import { HashRouter as Router } from 'react-router-dom';
import { observer, Provider } from 'mobx-react';
import { RouteComponentProps, Switch } from 'react-router';

import { NodesPageRoutes } from './nodes/NodesPage';
import { LocationProps, Menu, Navbar } from './NavBar';
import { NodeStore, Node, NodeStoreInterface } from './stores/NodeStore';
import { computed, observable } from 'mobx';

export class AppRouter extends React.Component<{}, {}> {
  public render() {
    return (
      <Router>
        <App>
          <Switch>
            { NodesPageRoutes.routes() }
          </Switch>
        </App>
      </Router>
    );
  }
}

export class App extends React.Component<{}, {}> {
  private client: any;

  private stores: {
    nodes: NodeStoreInterface,
  };

  @observable
  private nodes: NodeStoreInterface = new NodeStore();

  public constructor(props: any) {
    super(props);

    this.stores = {
      nodes: this.nodes,
    };

    this.client = io();
  }

  public componentDidMount() {
    // this.client.emit('nodes', (nodes) => {

    this.stores.nodes.push(
      ([
        {identifier: 'node1'},
        {identifier: 'node2'},
        {identifier: 'node3'},
      ])
        .map((data) => new Node(data))
    );

    setTimeout(() => {
      this.stores.nodes.push(new Node({
        identifier: 'node4',
      }));
    }, 1000);
    // });
  }

  protected menu(): Menu {
    return {
      title: 'Intent',
      link: '/',
      children: [
        {
          title: 'Nodes',
          link: NodesPageRoutes.path(),
        },
      ],
    };
  }

  public render() {
    let navProps: LocationProps = {
      ...this.props as RouteComponentProps<any>,
      menu: this.menu(),
    };

    let childrenProps = {
    };

    return (
      <Provider {...this.stores}>
        <div>
          <Navbar {...navProps} />

          {/*<Breadcrumbs crumbs={ this.breadcrumbs() } />*/}
          <div>
            <div className="col-lg-12">
              { React.Children.map(
                this.props.children,
                (child) => React.cloneElement(child as any, childrenProps)
              ) }
            </div>
          </div>
        </div>
      </Provider>
    );
  }
}
