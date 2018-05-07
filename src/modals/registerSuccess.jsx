import React from 'react';
import * as BS from 'react-bootstrap';
import {observer} from 'mobx-react';
import axios from 'axios';
import HTTPService from 'utils/HTTPService';
import validator from 'email-validator';

@observer
export default class RegisterSuccess extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.modalName = "registerSuccess";

    if(typeof this.props.store.modal.modals[this.modalName] == "undefined")
      this.props.store.modal.initModal(this.modalName);
  }

   render() {
     return (
      <BS.Modal show={this.props.store.modal.modals[this.modalName].show} onHide={() => {this.props.store.modal.hideModal(this.modalName); }}>
        <BS.Modal.Header closeButton>
          <BS.Modal.Title>You have registered successfully</BS.Modal.Title>
        </BS.Modal.Header>
        <BS.Modal.Body>
          <p>You can only activate your Account by confirming an e-mail, which we will send to your e-mail address in the next step.</p>
        </BS.Modal.Body>
      </BS.Modal>
     );
   }
}
