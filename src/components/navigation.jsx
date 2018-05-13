import React from 'react';
import * as BS from 'react-bootstrap';
import { observer } from "mobx-react";

import Login from "modals/login";
import Register from "modals/register";
import RegisterSuccess from "modals/registerSuccess";

@observer
export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <BS.Navbar inverse collapseOnSelect>
        <BS.Navbar.Header>
          <BS.Navbar.Brand>
            <a href="#brand">4fickr</a>
          </BS.Navbar.Brand>
          <BS.Navbar.Toggle />
        </BS.Navbar.Header>
        <BS.Navbar.Collapse>
          {this.props.store.user.loggedIn ? (
            <BS.Nav>
              <BS.NavItem eventKey={2} href="#" onClick={() => {this.props.store.modal.showModal("register"); }}>
                <BS.Glyphicon glyph="picture" />&nbsp;&nbsp;<span>Upload Image</span>
              </BS.NavItem>
            </BS.Nav>
          ) : (
            <BS.Nav>

            </BS.Nav>
          )}
          /*
          <BS.Nav>
            <BS.NavItem eventKey={1} href="#">
              Link
            </BS.NavItem>
            <BS.NavItem eventKey={2} href="#">
              Link
            </BS.NavItem>
            <BS.NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
              <BS.MenuItem eventKey={3.1}>Action</BS.MenuItem>
              <BS.MenuItem eventKey={3.2}>Another action</BS.MenuItem>
              <BS.MenuItem eventKey={3.3}>Something else here</BS.MenuItem>
              <BS.MenuItem divider />
              <BS.MenuItem eventKey={3.3}>Separated link</BS.MenuItem>
            </BS.NavDropdown>
          </BS.Nav>
          */
          {this.props.store.user.loggedIn ? (
            <BS.Nav pullRight>
              <BS.NavItem eventKey={2} href="#" onClick={() => {this.props.store.modal.showModal("register"); }}>
                <BS.Glyphicon glyph="user" />&nbsp;&nbsp;<span>{this.props.store.user.data.name}</span>
              </BS.NavItem>
            </BS.Nav>
          ) : (
            <BS.Nav pullRight>
              <BS.NavItem eventKey={1} href="#" onClick={() => {this.props.store.modal.showModal("login"); }}>
                <BS.Glyphicon glyph="log-in" />&nbsp;&nbsp;<span>Login</span>
              </BS.NavItem>
              <Login store={this.props.store} />
              <BS.NavItem eventKey={2} href="#" onClick={() => {this.props.store.modal.showModal("register"); }}>
                <BS.Glyphicon glyph="user" />&nbsp;&nbsp;<span>Register</span>
              </BS.NavItem>
              <Register store={this.props.store} />
              <RegisterSuccess store={this.props.store} />
            </BS.Nav>
          )}
        </BS.Navbar.Collapse>
      </BS.Navbar>
    );
  }
}
