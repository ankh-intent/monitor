
import * as React from 'react';
import { Route } from 'react-router-dom';
import { observer } from 'mobx-react';

import { Routed, RoutedLocation, RoutedMatch, RoutedHistory, Match } from '../routing/Routed';
import { ListPage } from './ListPage';

interface NodesPageParams {
}

interface NodesPageProps {
}

interface NodesPageState {
}

@observer
@Routed
export class NodesPage extends React.Component<NodesPageProps, NodesPageState> {
  static PATH = '/nodes';

  static path() {
    return this.PATH;
  }

  @RoutedMatch
  protected match: Match<NodesPageParams>;

  @RoutedLocation
  protected location: Location;

  @RoutedHistory
  protected history: History;

  componentWillReceiveProps(next) {
    this.setState({
    });
  }

  componentWillMount() {
    this.setState({
    });
  }

  public render() {
    let props = {};

    return (
      <div>
        { React.Children.map(
          this.props.children,
          (child) => React.cloneElement(child as any, props)
        ) }
      </div>
    );
  }
}

export const NodesPageRoutes = (
  <Route path={ NodesPage.path() } component={ NodesPage as any }>
    <Route exact path={ NodesPage.path() } component={ ListPage as any } />
  </Route>
);
