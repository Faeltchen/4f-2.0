import React from 'react';
import * as BS from 'react-bootstrap';
import {observer} from 'mobx-react';
import axios from 'axios';
import BEMHelper from 'react-bem-helper';
import HTTPService from 'utils/HTTPService';
import Dropzone from 'react-dropzone';
import FontAwesome from 'react-fontawesome';
import _ from "lodash";

var classes = new BEMHelper("uploadImage");

const initialState = {
  mainImage: {},
  mainImageErrors: [],
  mainImageProgress: 0,
  mainImageValidationState: null,
  requestPending: false,
};

@observer
export default class UploadImage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.modalName = "uploadImage";

    if(typeof this.props.store.modal.modals[this.modalName] == "undefined")
      this.props.store.modal.initModal(this.modalName);

    this.state = initialState;
  }

  onDrop(image) {
    this.setState({
      mainImage: image
    });
  }

  closeModal() {
    this.setState(initialState);
    this.props.store.modal.hideModal(this.modalName);
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
      this.setState({requestPending: true});
      var data = new FormData();
      data.append('token', this.props.store.user.token);
      data.append('mainImage', this.state.mainImage[0]);
      self.setState({mainImageErrors: []});
      HTTPService.post("/api/upload/image", data, (status, response) => {
        this.setState({requestPending: false});
        if(response.success) {
          setTimeout(function() {
              this.props.store.modal.hideModal(this.modalName);
              location.reload();
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
      <BS.Modal show={this.props.store.modal.modals[this.modalName].show} onHide={this.closeModal.bind(this)} {...classes()}>
        <BS.Modal.Header closeButton>
          <BS.Modal.Title>Upload your Image</BS.Modal.Title>
        </BS.Modal.Header>
        <form onSubmit={this.submit.bind(this)}>
          <BS.Modal.Body>
            <BS.FormGroup className controlId="mainImageUpload" validationState={this.state.mainImageValidationState}>
              {_.isEmpty(this.state.mainImage) ? (
                <div>
                  <Dropzone multiple={false} onDrop={this.onDrop.bind(this)}
                  className={"uploadImage__dropzone"}
                  activeClassName={"dropzone--active"}
                  acceptClassName={"dropzone--accept"}
                  rejectClassName={"dropzone--reject"}
                  disabledClassName={"dropzone--disabled"}>
                    <p>
                      Try dropping some files here, or click to select files to upload.<br/><br/>
                      <span><strong>Max filesize:</strong> 1MB</span><br/>
                      <span><strong>Supported formats</strong>: .gif, .jpg and .png</span>
                    </p>
                  </Dropzone>
                  <br/>
                  <p>By uploading a file you agree to the terms and conditions of 4fickr. Otherwise you will be punished and arrested in guantanamo bay.</p>
                  <BS.HelpBlock bsClass={'text-danger'}>
                    {this.state.mainImageErrors.map(function(error, index){
                      return <span key={ index }>● {error}</span>;
                    })}
                  </BS.HelpBlock>
                </div>
              ) : (
                <div>
                  <BS.Row>
                    <BS.Col lg={12} md={12} sm={12}>
                      <table>
                        <tbody>
                          <tr>
                            <td rowSpan={'2'}>
                              <div {...classes('previewImage')} style={{backgroundImage: 'url('+this.state.mainImage[0].preview+')'}}>
                              </div>
                            </td>
                            <td><span>{this.state.mainImage[0].name}</span></td>
                            <td style={{textAlign: 'right'}}>
                              <FontAwesome onClick={() => {this.setState(initialState);}} name='trash-alt' {...classes('delete')} />
                            </td>
                          </tr>
                          <tr>
                            <td><BS.ProgressBar now={this.state.mainImageProgress} label={this.state.mainImageProgress+'%'}  /></td>
                            <td style={{textAlign: 'right'}}>
                              <span>{this.bytesToSize((this.state.mainImageProgress * this.state.mainImage[0].size) / 100, false)}</span> / <span>{this.bytesToSize(this.state.mainImage[0].size, true)}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </BS.Col>
                  </BS.Row>
                  <br/>
                </div>
              )}
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
  bytesToSize(bytes, withExtension) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + (withExtension ? (' ' + sizes[i]) : '');
  }
}
