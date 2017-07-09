
import * as React from 'react';
import * as io from 'socket.io-client';

export interface AppProps {

}

export interface AppState {
  nodes: any[];
}

export class App extends React.Component<AppProps, AppState> {
  private client: any;

  public constructor(props: AppProps) {
    super(props);

    this.state = {
      nodes: [],
    };

    this.client = io();
  }

  public componentDidMount() {
    // this.client.emit('nodes', (nodes) => {
      this.setState({
        nodes: [
          {name: 'node1'},
          {name: 'node2'},
          {name: 'node3'},
        ],
      })
    // });
  }

  public render() {
    let { nodes } = this.state;

    return (
      <div>
        <h3>Hello App!</h3>
        <ul>
          { nodes.map((node) => (
            <li>{ JSON.stringify(node) }</li>
          )) }
        </ul>
      </div>
    );
  }
}
