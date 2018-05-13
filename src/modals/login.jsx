import React from 'react';
import * as BS from 'react-bootstrap';
import {observer} from 'mobx-react';
import axios from 'axios';
import HTTPService from 'utils/HTTPService';

@observer
export default class Login extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.modalName = "login";

    if(typeof this.props.store.modal.modals[this.modalName] == "undefined")
      this.props.store.modal.initModal(this.modalName);

    this.state = {
      username: '',
      usernameErrors: [],
      usernameValidationState: null,
      password: '',
      passwordErrors: [],
      passwordValidationState: null,
    };
  }

  checkUsername() {
    if (this.state.username.trim().length == 0) {
      this.setState({usernameValidationState: 'error'});
    }
    else {
      this.setState({usernameValidationState: 'success'});
    }
  }

  checkPassword() {
    if(this.state.password.length == 0) {
      this.setState({passwordValidationState: 'error'});
    }
    else {
      this.setState({passwordValidationState: 'success'});
    }
  }

    submit(e) {
      var self = this;
      e.preventDefault()

      this.checkUsername();
      this.checkPassword();

      if(this.state.usernameValidationState == "success" && this.state.passwordValidationState == "success") {
        HTTPService.post("/api/user/login", {
          username: this.state.username,
          password: this.state.password
        }, (status, data) => {
          self.setState({passwordErrors: []});
          self.setState({usernameErrors: []});
          if(data.success) {
            self.props.store.user.setToken(data.token);
            self.props.store.user.setUser(data.user);
            self.props.store.modal.hideModal("login");
          }
          else {
            if(data.errors.username.length) {
              self.setState({
                usernameErrors: data.errors.username,
                usernameValidationState: "warning",
              });
            }
            if(data.errors.password.length) {
              self.setState({
                passwordErrors: data.errors.password,
                passwordValidationState: "warning"
              });
            }
          }
        })
      }
    }

   render() {
     return (
      <BS.Modal show={this.props.store.modal.modals[this.modalName].show} onHide={() => {this.props.store.modal.hideModal(this.modalName); }}>
        <BS.Modal.Header closeButton>
          <BS.Modal.Title>Login</BS.Modal.Title>
        </BS.Modal.Header>
        <form onSubmit={this.submit.bind(this)}>
          <BS.Modal.Body>
            <BS.FormGroup className controlId="usernameLogin" validationState={this.state.usernameValidationState}>
              <BS.Row>
                <BS.Col lg={3} md={3} sm={3}>
                  <BS.ControlLabel className={"control-label-inline"}>Username</BS.ControlLabel>
                </BS.Col>
                <BS.Col lg={9} md={9} sm={9}>
                  <BS.FormControl type="text" value={this.state.username} placeholder=""
                  onBlur={this.checkUsername.bind(this)}
                  onChange={e => this.setState({ username: e.target.value })} />
                </BS.Col>
              </BS.Row>
              <BS.Row>
                <BS.Col lg={3} md={3} sm={3}>
                </BS.Col>
                <BS.Col lg={9} md={9} sm={9}>
                  <BS.HelpBlock>
                    {this.state.usernameErrors.map(function(error, index){
                      return <span key={ index }>● {error}</span>;
                    })}
                  </BS.HelpBlock>
                </BS.Col>
              </BS.Row>
            </BS.FormGroup>
            <BS.FormGroup className controlId="passwordLogin" validationState={this.state.passwordValidationState}>
              <BS.Row>
                <BS.Col lg={3} md={3} sm={3}>
                  <BS.ControlLabel className={"control-label-inline"}>Password</BS.ControlLabel>
                </BS.Col>
                <BS.Col lg={9} md={9} sm={9}>
                  <BS.FormControl type="password" placeholder="" value={this.state.password}
                  onBlur={this.checkPassword.bind(this)}
                  onChange={e => this.setState({ password: e.target.value })} />
                </BS.Col>
              </BS.Row>
              <BS.Row>
                <BS.Col lg={3} md={3} sm={3}>
                </BS.Col>
                <BS.Col lg={9} md={9} sm={9}>
                  <BS.HelpBlock>
                    {this.state.passwordErrors.map(function(error, index){
                      return <span key={ index }>● {error}</span>;
                    })}
                  </BS.HelpBlock>
                </BS.Col>
              </BS.Row>
            </BS.FormGroup>
          </BS.Modal.Body>
          <BS.Modal.Footer>
            <BS.Row>
              <BS.Col lg={9} md={10} sm={10}>
              </BS.Col>
              <BS.Col lg={3} md={2} sm={2}>
                <BS.Button type="submit" >Submit</BS.Button>
              </BS.Col>
            </BS.Row>
          </BS.Modal.Footer>
        </form>
      </BS.Modal>
     );
   }
}
