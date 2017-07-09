
import * as React from 'react';
import * as io from 'socket.io-client';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { RouteComponentProps, Switch } from 'react-router';

import { NodesPageRoutes } from './nodes/NodesPage';
import { LocationProps, Menu, Navbar } from './NavBar';
import { NodeStore, Node, NodeStoreInterface } from './stores/NodeStore';
import { observable } from 'mobx';

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

  public constructor(props: any) {
    super(props);

    this.stores = {
      nodes: new NodeStore(),
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
                (child) => React.cloneElement(child as any, this.props)
              ) }
            </div>
          </div>
        </div>
      </Provider>
    );
  }
}
