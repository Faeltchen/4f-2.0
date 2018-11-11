import React from 'react';
import * as BS from 'react-bootstrap';
import {observer} from 'mobx-react';
import axios from 'axios';
import HTTPService from 'utils/HTTPService';
import FontAwesome from 'react-fontawesome';

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
      requestPending: false,
    };
  }

  checkUsername() {
    this.setState({usernameErrors: []});
    if (this.state.username.trim().length == 0) {
      this.setState({usernameValidationState: 'error'});
    }
    else {
      this.setState({usernameValidationState: null});
    }
  }

  checkPassword() {
    this.setState({passwordErrors: []});
    if(this.state.password.length == 0) {
      this.setState({passwordValidationState: 'error'});
    }
    else {
      this.setState({passwordValidationState: null});
    }
  }

    submit(e) {
      var self = this;
      e.preventDefault()

      this.checkUsername();
      this.checkPassword();

      if(this.state.usernameValidationState == null && this.state.passwordValidationState == null) {
        this.setState({requestPending: true});
        HTTPService.post("/api/user/login", {
          username: this.state.username,
          password: this.state.password
        }, (status, data) => {
          self.setState({passwordErrors: []});
          self.setState({usernameErrors: []});
          self.setState({requestPending: false});
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
                <BS.Col lg={3} md={3} sm={3} xs={4}>
                  <BS.ControlLabel className={"control-label-inline"}>Username</BS.ControlLabel>
                </BS.Col>
                <BS.Col lg={9} md={9} sm={9} xs={8} style={{position: 'initial'}}>
                  <BS.FormControl type="text" value={this.state.username} placeholder=""
                  onBlur={this.checkUsername.bind(this)}
                  onChange={e => this.setState({ username: e.target.value })} />
                  <BS.FormControl.Feedback />
                </BS.Col>
              </BS.Row>
              <BS.Row>
                <BS.Col lg={3} md={3} sm={3} xs={4}>
                </BS.Col>
                <BS.Col lg={9} md={9} sm={9} xs={8}>
                  <BS.HelpBlock>
                    {this.state.usernameErrors.map(function(error, index){
                      return <span key={ index }>{error}</span>;
                    })}
                  </BS.HelpBlock>
                </BS.Col>
              </BS.Row>
            </BS.FormGroup>
            <BS.FormGroup className controlId="passwordLogin" validationState={this.state.passwordValidationState}>
              <BS.Row>
                <BS.Col lg={3} md={3} sm={3} xs={4}>
                  <BS.ControlLabel className={"control-label-inline"}>Password</BS.ControlLabel>
                </BS.Col>
                <BS.Col lg={9} md={9} sm={9} xs={8} style={{position: 'initial'}}>
                  <BS.FormControl type="password" placeholder="" value={this.state.password}
                  onBlur={this.checkPassword.bind(this)}
                  onChange={e => this.setState({ password: e.target.value })} />
                  <BS.FormControl.Feedback />
                </BS.Col>
              </BS.Row>
              <BS.Row>
                <BS.Col lg={3} md={3} sm={3} xs={4}>
                </BS.Col>
                <BS.Col lg={9} md={9} sm={9} xs={8}>
                  <BS.HelpBlock>
                    {this.state.passwordErrors.map(function(error, index){
                      return <span key={ index }>{error}</span>;
                    })}
                  </BS.HelpBlock>
                </BS.Col>
              </BS.Row>
            </BS.FormGroup>
          </BS.Modal.Body>
          <BS.Modal.Footer>
            {this.state.requestPending ? (
              <BS.Row>
              <BS.Col lg={7} md={7} sm={7} xs={3}>
              </BS.Col>
              <BS.Col lg={2} md={2} sm={2} xs={4} style={{paddingRight: 0}}>
              </BS.Col>
                <BS.Col lg={3} md={3} sm={3} xs={5}>
                  <BS.Button bsStyle="primary" style={{width: "100%", fontSize: "21px", paddingTop: "1px", paddingBottom: "1px"}}>
                    <FontAwesome name='spinner' spin />
                  </BS.Button>
                </BS.Col>
              </BS.Row>
            ): (
              <BS.Row>
                <BS.Col lg={7} md={7} sm={7} xs={3}>
                </BS.Col>
                <BS.Col lg={2} md={2} sm={2} xs={4} style={{paddingRight: 0}}>
                  <BS.Button style={{width: "100%"}}  onClick={() => {this.props.store.modal.hideModal(this.modalName);}}>
                    Cancel
                  </BS.Button>
                </BS.Col>
                <BS.Col lg={3} md={3} sm={3} xs={5}>
                  <BS.Button type="submit" bsStyle="primary" style={{width: "100%"}}>
                    Submit
                  </BS.Button>
                </BS.Col>
              </BS.Row>
            )}
          </BS.Modal.Footer>
        </form>
      </BS.Modal>
     );
   }
}
