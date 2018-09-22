
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Route, RouteComponentProps } from 'react-router';
import { NodeStoreInterface, Node } from '../stores/NodeStore';
import { NavLink } from 'react-router-dom';
import { ShowPageRoutes } from './ShowPage';
import { NodesPageRoutes } from './NodesPage';
import { EditPageRoutes } from './EditPage';
import { PanelHeader, PanelList } from '../panel';
import { Panel } from '../panel';
import { Routed } from '../routing/Routed';

export interface NodeListItemProps {
  nodes?: NodeStoreInterface;
  node: Node;
}

@inject('nodes')
@observer
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


        <NavLink className="pull-right" to={ EditPageRoutes.path(this.props.nodes.find(this.props.node.identifier)) }>
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
@Routed
export class ListPage extends React.Component<ListPageProps, ListPageState> {
  public render() {
    return (
      <Panel>
        <PanelHeader>
          Nodes:
        </PanelHeader>

        <PanelList>
          { this.props.nodes.all.map((node) => (
            <li key={ node.identifier } className="list-group-item">
              <NodeListItem node={node} />
            </li>
          )) }
        </PanelList>
      </Panel>
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
