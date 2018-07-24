import React from 'react';
import * as BS from 'react-bootstrap';
import {observer} from 'mobx-react';
import axios from 'axios';
import HTTPService from 'utils/HTTPService';
import validator from 'email-validator';
import FontAwesome from 'react-fontawesome';

@observer
export default class Register extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.modalName = "register";

    if(typeof this.props.store.modal.modals[this.modalName] == "undefined")
      this.props.store.modal.initModal(this.modalName);

    this.state = {
      username: '',
      usernameErrors: [],
      usernameValidationState: null,
      email: '',
      emailErrors: [],
      emailValidationState: null,
      password: '',
      passwordErrors: [],
      passwordValidationState: null,
      passwordRepeat: '',
      passwordRepeatValidationState: null,
      agreement: '',
      agreementValidationState: null,
      requestPending: false,
    };
  }

  checkUsername() {
    this.setState({usernameErrors: []});
    if (this.state.username.trim().length >= 5 && this.state.username.trim().length <= 20) {
      this.setState({usernameValidationState: 'success'});
    }
    else {
      this.setState({usernameValidationState: 'error'});
    }
  }

  checkEmail() {
    this.setState({emailErrors: []});
    if(validator.validate(this.state.email)) {
      this.setState({emailValidationState: "success"});
    }
    else {
      this.setState({emailValidationState: "error"});
    }
  }

  checkPassword() {
    this.setState({passwordErrors: []});
    if (this.state.password.length >= 8 && this.state.password.length <= 20) {
      this.setState({passwordValidationState: 'success'});
    }
    else {
      this.setState({passwordValidationState: 'error'});
    }
   }

   checkPasswordRepeat() {
     if(this.state.passwordValidationState == "success" && this.state.password == this.state.passwordRepeat) {
       this.setState({passwordRepeatValidationState: 'success'});
     }
     else {
       this.setState({passwordRepeatValidationState: 'error'});
     }
   }

   checkAgreement() {
     if(this.state.agreement) {
       this.setState({agreementValidationState: null});
     }
     else {
       this.setState({agreementValidationState: 'error'});
     }
   }

    submit(e) {
      var self = this;
      e.preventDefault()

      this.checkUsername();
      this.checkEmail();
      this.checkPassword();
      this.checkPasswordRepeat();
      this.checkAgreement();

      if(this.state.usernameValidationState == "success" &&
      this.state.emailValidationState == "success" &&
      this.state.passwordValidationState == "success" &&
      this.state.passwordRepeatValidationState == "success" &&
      this.state.agreement) {
        self.setState({requestPending: true});
        HTTPService.post("/api/user/create", {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password
        }, (status, data) => {
          self.setState({requestPending: false});
          if(data.success) {
            self.props.store.modal.hideModal(this.modalName);
            self.props.store.modal.showModal("registerSuccess");
          }
          else {
            if(data.username.length) {
              self.setState({
                usernameErrors: data.username,
                usernameValidationState: "warning"
              });
            }
            if(data.email.length) {
              self.setState({
                emailErrors: data.email,
                emailValidationState: "warning"
              });
            }
            if(data.password.length) {
              self.setState({
                passwordErrors: data.password,
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
          <BS.Modal.Title>Registration</BS.Modal.Title>
        </BS.Modal.Header>
        <form onSubmit={this.submit.bind(this)}>
          <BS.Modal.Body>
            <BS.FormGroup className controlId="usernameRegister" validationState={this.state.usernameValidationState}>
              <BS.Row>
                <BS.Col lg={3} md={3} sm={3}>
                  <BS.ControlLabel className={"control-label-inline"}>Username</BS.ControlLabel>
                </BS.Col>
                <BS.Col lg={9} md={9} sm={9} style={{position: 'initial'}}>
                  <BS.FormControl type="text" value={this.state.username} placeholder="Enter name from 5 to 20 characters"
                  onBlur={this.checkUsername.bind(this)}
                  onChange={e => this.setState({ username: e.target.value })} />
                  <BS.FormControl.Feedback />
                </BS.Col>
              </BS.Row>
              <BS.Row>
                <BS.Col lg={3} md={3} sm={3}>
                </BS.Col>
                <BS.Col lg={9} md={9} sm={9}>
                  <BS.HelpBlock>
                    {this.state.usernameErrors.map(function(error, index){
                      return <span key={ index }>{error}</span>;
                    })}
                  </BS.HelpBlock>
                </BS.Col>
              </BS.Row>
            </BS.FormGroup>
            <BS.FormGroup className controlId="emailRegister" validationState={this.state.emailValidationState}>
              <BS.Row>
                <BS.Col lg={3} md={3} sm={3}>
                  <BS.ControlLabel className={"control-label-inline"}>Email address</BS.ControlLabel>
                </BS.Col>
                <BS.Col lg={9} md={9} sm={9} style={{position: 'initial'}}>
                  <BS.FormControl type="email" value={this.state.email} placeholder="Enter email"
                  onBlur={this.checkEmail.bind(this)}
                  onChange={e => this.setState({ email: e.target.value })} />
                  <BS.FormControl.Feedback />
                </BS.Col>
              </BS.Row>
              <BS.Row>
                <BS.Col lg={3} md={3} sm={3}>
                </BS.Col>
                <BS.Col lg={9} md={9} sm={9}>
                  <BS.HelpBlock>
                    {this.state.emailErrors.map(function(error, index){
                      return <span key={ index }>{error}</span>;
                    })}
                  </BS.HelpBlock>
                </BS.Col>
              </BS.Row>
            </BS.FormGroup>
            <BS.FormGroup className controlId="passwordRegister" validationState={this.state.passwordValidationState}>
              <BS.Row>
                <BS.Col lg={3} md={3} sm={3}>
                  <BS.ControlLabel className={"control-label-inline"}>Password</BS.ControlLabel>
                </BS.Col>
                <BS.Col lg={9} md={9} sm={9} style={{position: 'initial'}}>
                  <BS.FormControl type="password" placeholder="Enter password from 8 to 20 characters" value={this.state.password}
                  onBlur={this.checkPassword.bind(this)}
                  onChange={e => this.setState({ password: e.target.value })} />
                  <BS.FormControl.Feedback />
                </BS.Col>
              </BS.Row>
              <BS.Row>
                <BS.Col lg={3} md={3} sm={3}>
                </BS.Col>
                <BS.Col lg={9} md={9} sm={9}>
                  <BS.HelpBlock>
                    {this.state.passwordErrors.map(function(error, index){
                      return <span key={ index }>{error}</span>;
                    })}
                  </BS.HelpBlock>
                </BS.Col>
              </BS.Row>
            </BS.FormGroup>
            <BS.FormGroup className controlId="passwordRepeatRegister" validationState={this.state.passwordRepeatValidationState}>
              <BS.Row>
                <BS.Col lg={3} md={3} sm={3}>
                  <BS.ControlLabel className={"control-label-inline"}>Repeat password</BS.ControlLabel>
                </BS.Col>
                <BS.Col lg={9} md={9} sm={9} style={{position: 'initial'}}>
                  <BS.FormControl type="password" value={this.state.passwordRepeat}
                  onBlur={this.checkPasswordRepeat.bind(this)}
                  onChange={e => this.setState({ passwordRepeat: e.target.value })} />
                  <BS.FormControl.Feedback />
                </BS.Col>
              </BS.Row>
              <BS.Row>
                <BS.Col lg={3} md={3} sm={3}>
                </BS.Col>
                <BS.Col lg={9} md={9} sm={9}>
                  <BS.HelpBlock>
                  </BS.HelpBlock>
                </BS.Col>
              </BS.Row>
            </BS.FormGroup>
            <BS.FormGroup className controlId="agreementRegister" validationState={this.state.agreementValidationState}>
              <BS.Checkbox value={this.state.agreement} onClick={e => this.setState({ agreementValidationState: null })} onChange={e => this.setState({ agreement: e.target.checked })} >
                I agree with all rules and the Terms & Conditions of 4f.
              </BS.Checkbox>
            </BS.FormGroup>
          </BS.Modal.Body>
          <BS.Modal.Footer>
            {this.state.requestPending ? (
              <BS.Row>
                <BS.Col lg={9} md={9} sm={9} xs={7}>
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
                  <BS.Button style={{width: "100%"}} onClick={() => {this.props.store.modal.hideModal(this.modalName);}}>
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
