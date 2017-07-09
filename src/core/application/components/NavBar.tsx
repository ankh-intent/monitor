
import * as React from 'react';

import { NavLink, RouteComponentProps } from 'react-router-dom';

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
            <NavLink to={ menu.link } className="navbar-brand">
              { menu.title }
            </NavLink>

          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            { menu.children ? (
              <div>
                { this.menu(menu.children, 'nav navbar-nav navbar-right') }
              </div>
            ) : null }
          </div>
        </div>
      </nav>
    );
  }

  protected menu(items: Menu[], className: string = null) {
    return (
      <ul className={ className }>
        { items.map((child) =>
          <li>
            <NavLink to={ child.link }>{ child.title }</NavLink>
            { child.children ? (
              <ul>
                { this.menu(child.children) }
              </ul>
            ) : null}
          </li>
        ) }
      </ul>
    )
  }
}
