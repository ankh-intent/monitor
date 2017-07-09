
import * as React from 'react';

import { Link, RouteComponentProps } from 'react-router-dom';

export interface PageLink {
  title: string;
  link: string;
}

export interface Menu extends PageLink {
  children?: Menu[];
}

export interface LocationProps extends RouteComponentProps<any> {
  menu: Menu;
}

export class Navbar extends React.Component<LocationProps, {}> {
  public render() {
    let { menu } = this.props;

    return (
      <nav className="navbar navbar-dark navbar-fixed.top" role="navigation">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <Link to={ menu.link } className="navbar-brand">
              { menu.title }
            </Link>

          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            { menu.children ? (
              <ul className="nav navbar-nav navbar-right">
                { menu.children.map((child) =>
                  <li><Link to={ child.link }>{ child.title }</Link></li>
                ) }
              </ul>
            ) : null }
          </div>
        </div>
      </nav>
    );
  }
}
