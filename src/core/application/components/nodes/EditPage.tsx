
import * as React from 'react';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import { RoutedMatch, Match, Routed } from '../routing/Routed';
import { Route, RouteComponentProps } from 'react-router';
import { NavLink } from 'react-router-dom';

import { NodeStoreInterface, Node } from '../stores/NodeStore';
import { NodesPageRoutes } from './NodesPage';
import { ShowPageRoutes } from './ShowPage';

interface EditPageParams {
  node: string;
}

export interface EditPageProps{
  nodes?: NodeStoreInterface;
}

export interface EditPageState {
}

@inject('nodes')
@observer
@Routed
export class EditPage extends React.Component<EditPageProps & RouteComponentProps<any>, EditPageState> {
  @RoutedMatch
  protected match: Match<EditPageParams>;

  @computed
  protected get node(): Node {
    return this.props.nodes.find(this.match.params.node);
  }

  public render() {
    return (
      <div>
        <NavLink to={ ShowPageRoutes.path(this.node) }>&larr; Back</NavLink>
        Edit node: { JSON.stringify( this.node ) }
      </div>
    );
  }
}

export const EditPageRoutes = {
  path(node?: Node): string {
    return NodesPageRoutes.path(
      `${node ? node.identifier : ':node'}/edit`
    );
  },
  routes() {
    return this._routes || (this._routes = (
      <Route path={ this.path() } component={ EditPage } />
    ));
  }
};
