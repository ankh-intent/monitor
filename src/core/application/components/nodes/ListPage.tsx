
import * as React from 'react';
import { Routed } from '../routing/Routed';
import { inject, observer } from 'mobx-react';

export interface NodeStoreInterface {
  all(): any[];
}

export interface ListPageProps {
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
      <ul>
        { this.props.nodes.all().map((node) => (
          <li>
            <NodeListItem node={node} />
          </li>
        )) }
      </ul>
    );
  }
}

export interface NodeListItemProps {
  node: any;
}

export class NodeListItem extends React.Component<NodeListItemProps, {}> {
  public render() {
    return (
      <span>Item: { JSON.stringify(this.props.node) }</span>
    );
  }
}
