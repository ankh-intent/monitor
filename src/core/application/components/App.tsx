
import * as React from 'react';
import * as io from 'socket.io-client';
import { HashRouter, Route } from 'react-router-dom';
import { observable } from 'mobx';
import { Provider } from 'mobx-react';
import { RouteComponentProps } from 'react-router';

import { NodesPageRoutes } from './nodes/NodesPage';
import { LocationProps, Menu, Navbar } from './NavBar';
import { NodeStoreInterface } from './nodes/ListPage';

export class AppRouter extends React.Component<{}, {}> {
  public render() {
    return (
      <HashRouter>
        <Route component={ App }>
          { NodesPageRoutes }
        </Route>
      </HashRouter>
    );
  }
}

class Node {
  @observable data = observable.map();

  constructor(data = {}) {
    this.data.merge(data);
  }
}

class Nodes implements NodeStoreInterface {
  @observable
  private store: any[] = [];

  public all(): any[] {
    return this.store;
  }

  public push(node: any): number {
    return this.store.push(node);
  }
}

export class App extends React.Component<RouteComponentProps<any>, {}> {
  private client: any;
  private stores: {
    nodes: Nodes,
  };

  public constructor(props: any) {
    super(props);

    this.stores = {
      nodes: new Nodes(),
    };

    this.client = io();
  }

  public componentDidMount() {
    // this.client.emit('nodes', (nodes) => {

    let nodes = [
      {name: 'node1'},
      {name: 'node2'},
      {name: 'node3'},
    ];

    for (let node of nodes) {
      this.stores.nodes.push(new Node(
        node
      ));
    }
    // });
  }

  protected menu(): Menu {
    return {
      title: 'Intent',
      link: '/',
      children: [
        {
          title: 'Nodes',
          link: '/nodes',
        }
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
