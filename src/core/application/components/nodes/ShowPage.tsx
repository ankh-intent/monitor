
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';
import { NavLink } from 'react-router-dom';
import { RoutedMatch, Match, Routed } from '../routing/Routed';

import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';

import { NodeStoreInterface, Node } from '../stores/NodeStore';

import { NodesPageRoutes } from './NodesPage';
import { ListPageRoutes } from './ListPage';
import { EditPageRoutes } from './EditPage';
import { Panel, PanelBody, PanelFooter, PanelHeader } from '../panel';

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
    return (this.node || null) && (
      <Panel>
        <PanelHeader>
          Node: { this.node.identifier }
        </PanelHeader>

        <PanelBody>
          Node: { JSON.stringify(this.node) }

          <div>
            <NavLink to={ EditPageRoutes.path(this.node) }>
              Edit
            </NavLink>
          </div>
        </PanelBody>

        <PanelFooter>
          <NavLink to={ ListPageRoutes.path() }>&larr; Back</NavLink>
        </PanelFooter>
      </Panel>
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
