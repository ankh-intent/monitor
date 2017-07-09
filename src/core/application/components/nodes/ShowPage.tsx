
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { NodeStoreInterface, Node } from '../stores/NodeStore';
import { RoutedMatch, Match, Routed } from '../routing/Routed';
import { NodesPageRoutes } from './NodesPage';
import { Route, RouteComponentProps } from 'react-router';
import { NavLink } from 'react-router-dom';
import { ListPageRoutes } from './ListPage';
import { EditPageRoutes } from './EditPage';
import { computed, observable } from 'mobx';

interface ShowPageParams {
  node: string;
}

export interface ShowPageProps{
  nodes?: NodeStoreInterface;
}

export interface ShowPageState {
}

@inject('nodes')
@observer
@Routed
export class ShowPage extends React.Component<ShowPageProps & RouteComponentProps<any>, ShowPageState> {
  @RoutedMatch
  protected match: Match<ShowPageParams>;

  @computed
  protected get node(): Node {
    return this.props.nodes.find(this.match.params.node);
  }

  public render() {
    return (
      <div>
        <NavLink to={ ListPageRoutes.path() }>&larr; Back</NavLink>
        Node: { JSON.stringify(this.node) }

        <div>
          <NavLink to={ EditPageRoutes.path(this.node) }>
            Edit
          </NavLink>
        </div>
      </div>
    );
  }
}

export const ShowPageRoutes = {
  path(node?: Node): string {
    return NodesPageRoutes.path(
      `${node ? node.identifier : ':node'}/show`
    );
  },
  routes() {
    return this._routes || (this._routes = (
      <Route path={ this.path() } component={ ShowPage } />
    ));
  }
};
