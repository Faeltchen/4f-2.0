import React from 'react';
import * as BS from 'react-bootstrap';
import {observer} from 'mobx-react';
import axios from 'axios';
import HTTPService from 'utils/HTTPService';

@observer
export default class Register extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.modalName = "register";

    if(typeof this.props.store.modal.modals[this.modalName] == "undefined")
      this.props.store.modal.initModal(this.modalName);

    this.state = {
      username: '',
      usernameValidationState: null,
      email: '',
      emailValidationState: null,
      password: '',
      passwordValidationState: null,
      passwordRepeat: '',
      passwordRepeatValidationState: null,
      agreementValidationState: null
    };
   }

  checkPassword() {
    if (this.state.password.length >= 8 && this.state.password.length <= 20) {
      this.setState({passwordValidationState: 'success'});
    }
    else if(this.state.password.length == 0) {
      this.setState({passwordValidationState: null});
    }
    else {
      this.setState({passwordValidationState: 'error'});
    }
   }

   checkPasswordRepeat() {
     if(this.state.passwordValidationState == "success" && this.state.password == this.state.passwordRepeat) {
       this.setState({passwordRepeatValidationState: 'success'});
     }
     else if(this.state.passwordRepeat.length == 0) {
       this.setState({passwordRepeatValidationState: null});
     }
     else {
       this.setState({passwordRepeatValidationState: 'error'});
     }
   }

    sendForm() {
      /*
      axios.post('/user', {
      firstName: 'Fred',
      lastName: 'Flintstone'
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    */
    /*
      const service = axios.create({
        baseURL: "http://"+window.location.hostname+':'+process.env.API_PORT,
      });
      service.request({
        method: 'post',
        url: '/api/createUser',
        responseType: 'json',
        data: {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password
        },
      }).then((response) => {
        console.log(response)
      });
      */
      HTTPService.post("/api/createUser", {username: this.state.username}, (status, data) => {
        console.log(data);
      })
    }

   render() {
     console.log("render reg");
     //console.log(this.state);
     return (
      <BS.Modal show={this.props.store.modal.modals[this.modalName].show} onHide={() => {this.props.store.modal.hideModal(this.modalName); }}>
        <BS.Modal.Header closeButton>
          <BS.Modal.Title>Registration</BS.Modal.Title>
        </BS.Modal.Header>
        <BS.Modal.Body>
          <BS.FormGroup className controlId="usernameRegister" validationState={this.state.usernameValidationState}>
            <BS.Row>
              <BS.Col lg={2} md={3} sm={3}>
                <BS.ControlLabel className={"control-label-inline"}>Username</BS.ControlLabel>
              </BS.Col>
              <BS.Col lg={10} md={9} sm={9}>
                <BS.FormControl type="text" value={this.state.username} placeholder="Enter name from 5 to 20 characters" onChange={e => this.setState({ username: e.target.value })} />
              </BS.Col>
            </BS.Row>
          </BS.FormGroup>
          <BS.FormGroup className controlId="emailRegister" validationState={this.state.emailValidationState}>
            <BS.Row>
              <BS.Col lg={2} md={3} sm={3}>
                <BS.ControlLabel className={"control-label-inline"}>Email address</BS.ControlLabel>
              </BS.Col>
              <BS.Col lg={10} md={9} sm={9}>
                <BS.FormControl type="email" value={this.state.email} placeholder="Enter email" onChange={(e) => {
                  this.setState({ email: e.target.value });
                }} />
              </BS.Col>
            </BS.Row>
          </BS.FormGroup>
          <BS.FormGroup className controlId="passwordRegister" validationState={this.state.passwordValidationState}>
            <BS.Row>
              <BS.Col lg={2} md={3} sm={3}>
                <BS.ControlLabel className={"control-label-inline"}>Password</BS.ControlLabel>
              </BS.Col>
              <BS.Col lg={10} md={9} sm={9}>
                <BS.FormControl type="password" placeholder="Enter password from 8 to 20 characters" value={this.state.password}
                  onBlur={this.checkPassword.bind(this)}
                  onChange={(e) => {
                    this.setState({ password: e.target.value });
                  }}  />
              </BS.Col>
            </BS.Row>
          </BS.FormGroup>
          <BS.FormGroup className controlId="passwordRepeatRegister" validationState={this.state.passwordRepeatValidationState}>
            <BS.Row>
              <BS.Col lg={2} md={3} sm={3}>
                <BS.ControlLabel className={"control-label-inline"}>Repeat password</BS.ControlLabel>
              </BS.Col>
              <BS.Col lg={10} md={9} sm={9}>
                <BS.FormControl type="password" value={this.state.passwordRepeat} onBlur={this.checkPasswordRepeat.bind(this)} onChange={e => this.setState({ passwordRepeat: e.target.value })} />
              </BS.Col>
            </BS.Row>
          </BS.FormGroup>
          <BS.Checkbox>I agree with all rules and the Terms & Conditions of 4f.</BS.Checkbox>
        </BS.Modal.Body>
        <BS.Modal.Footer>
          <BS.Row>
            <BS.Col lg={10} md={10} sm={10}>
            </BS.Col>
            <BS.Col lg={2} md={2} sm={2}>
              <BS.Button type="submit" onClick={this.sendForm.bind(this)}>Submit</BS.Button>
            </BS.Col>
          </BS.Row>
        </BS.Modal.Footer>
      </BS.Modal>
     );
   }
}
