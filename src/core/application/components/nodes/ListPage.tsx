
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Route, RouteComponentProps } from 'react-router';
import { NodeStoreInterface, Node } from '../stores/NodeStore';
import { NavLink } from 'react-router-dom';
import { ShowPageRoutes } from './ShowPage';
import { NodesPageRoutes } from './NodesPage';
import { EditPageRoutes } from './EditPage';

export interface NodeListItemProps {
  node: Node;
}

export class NodeListItem extends React.Component<NodeListItemProps, {}> {

  public render() {
    return (
      <span>
        <span>
          Item:&nbsp;
          <NavLink to={ ShowPageRoutes.path(this.props.node) }>
            { this.props.node.identifier }
          </NavLink>
        </span>


        <NavLink className="pull-right" to={ EditPageRoutes.path(this.props.node) }>
          Edit
        </NavLink>
      </span>
    );
  }
}

export interface ListPageProps extends RouteComponentProps<any> {
  nodes?: NodeStoreInterface;
}

export interface ListPageState {
}

@inject('nodes')
@observer
export class ListPage extends React.Component<ListPageProps, ListPageState> {
  public render() {
    return (
      <ul>
        { this.props.nodes.all.map((node) => (
          <li key={ node.identifier }>
            <NodeListItem node={node} />
          </li>
        )) }
      </ul>
    );
  }
}

export const ListPageRoutes = {
  path(append?: string) {
    return NodesPageRoutes.path(
      append
        ? `list/${append}`
        : `list`
    );
  },
  routes() {
    return this._routes || (this._routes = (
      <Route path={ this.path() } exact component={ ListPage } />
    ));
  }
};
