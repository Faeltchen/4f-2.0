import React from 'react';
import * as BS from 'react-bootstrap';
import {observer} from 'mobx-react';
import axios from 'axios';
import HTTPService from 'utils/HTTPService';
import Dropzone from 'react-dropzone'
import _ from "lodash";

@observer
export default class Login extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.modalName = "uploadImage";

    if(typeof this.props.store.modal.modals[this.modalName] == "undefined")
      this.props.store.modal.initModal(this.modalName);

    this.state = {
      mainImage: {},
      mainImageErrors: [],
      mainImageProgress: 0,
      mainImageValidationState: null,
    };
  }

  onDrop(image) {
    this.setState({
      mainImage: image
    });
  }

  submit(e) {
    var self = this;
    e.preventDefault()

    if(_.isEmpty(this.state.mainImage)) {
      self.setState(prevState => ({
        mainImageErrors: [...prevState.mainImageErrors, "Please select a main image file."]
      }))
    }
    else {
      var data = new FormData();
      data.append('token', this.props.store.user.token);
      data.append('mainImage', this.state.mainImage[0]);
      self.setState({mainImageErrors: []});
      HTTPService.post("/api/upload/image", data, (status, response) => {
        if(response.success) {
          setTimeout(function() {
              this.props.store.modal.hideModal(this.modalName);
          }.bind(this), 1000)
        }
      }, function(progressEvent) {
        self.setState({
          mainImageProgress: Math.round( (progressEvent.loaded * 100) / progressEvent.total )
        });
      });
    }
  }
//accept="image/*"
   render() {
     return (
      <BS.Modal show={this.props.store.modal.modals[this.modalName].show} onHide={() => {this.props.store.modal.hideModal(this.modalName); }}>
        <BS.Modal.Header closeButton>
          <BS.Modal.Title>Upload your Image</BS.Modal.Title>
        </BS.Modal.Header>
        <form onSubmit={this.submit.bind(this)}>
          <BS.Modal.Body>
            <BS.FormGroup className controlId="mainImageUpload" validationState={this.state.mainImageValidationState}>
              {_.isEmpty(this.state.mainImage) ? (
                <div>
                  <Dropzone multiple={false} onDrop={this.onDrop.bind(this)}
                  className={"dropzone"}
                  activeClassName={"dropzone--active"}
                  acceptClassName={"dropzone--accept"}
                  rejectClassName={"dropzone--reject"}
                  disabledClassName={"dropzone--disabled"}>
                    <p>Try dropping some files here, or click to select files to upload.</p>
                  </Dropzone>
                  <BS.HelpBlock>
                    {this.state.mainImageErrors.map(function(error, index){
                      return <span key={ index }>● {error}</span>;
                    })}
                  </BS.HelpBlock>
                </div>
              ) : (
                <div>
                  <BS.Row>
                    <BS.Col lg={4} md={4} sm={4}>
                      <img style={{width: "100%"}} src={this.state.mainImage[0].preview} />
                    </BS.Col>
                    <BS.Col lg={4} md={4} sm={4}>
                      <span>{this.state.mainImage[0].name}</span>
                    </BS.Col>
                    <BS.Col lg={4} md={4} sm={4}>
                      <span>{this.state.mainImage[0].size} Bytes</span>
                    </BS.Col>
                  </BS.Row>
                  <br/>
                  <BS.Row>
                    <BS.Col lg={12} md={12} sm={12}>
                      <BS.ProgressBar now={this.state.mainImageProgress} label={this.state.mainImageProgress+'%'}  />
                    </BS.Col>
                  </BS.Row>
                </div>
              )}
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
