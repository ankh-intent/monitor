
import * as React from 'react';
import { Route } from 'react-router-dom';
import { observer } from 'mobx-react';

import { Redirect } from 'react-router';
import { ListPageRoutes } from './ListPage';
import { ShowPageRoutes } from './ShowPage';
import { EditPageRoutes } from './EditPage';

interface NodesPageParams {
}

interface NodesPageProps {
}

interface NodesPageState {
}

@observer
export class NodesPage extends React.Component<NodesPageProps, NodesPageState> {
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

export const NodesPageRoutes = {
  path(append?: string) {
    return (
      append
        ? `/nodes/${append}`
        : `/nodes`
    );
  },
  routes() {
    return this._routes || (this._routes = (
      <NodesPage>
        <Route exact path={ this.path() } render={ () => <Redirect to={ ListPageRoutes.path() } /> } />

        { ListPageRoutes.routes() }
        { ShowPageRoutes.routes() }
        { EditPageRoutes.routes() }
      </NodesPage>
    ));
  }
};
