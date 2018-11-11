import React from 'react';
import * as BS from 'react-bootstrap';
import {observer} from 'mobx-react';
import axios from 'axios';
import BEMHelper from 'react-bem-helper';
import HTTPService from 'utils/HTTPService';
import Dropzone from 'react-dropzone';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import path from 'path';

import { imageUpload as imageUploadErrors } from 'constants/errorCodes';
import globalConfig from 'configs/global.js';
import { bytesToSize } from 'helpers/files';

var classes = new BEMHelper("uploadImage");

const initialState = {
  mainImage: {},
  mainImageErrors: [],
  mainImageProgress: 0,
  mainImageValidationState: null,
  addCommentOpen: false,
  addComment: '',
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

  closeModal() {
    this.setState(initialState);
    this.props.store.modal.hideModal(this.modalName);
  }

  submit(e) {
    var self = this;
    e.preventDefault()

    if(_.isEmpty(this.state.mainImage)) {
      self.setState({mainImageErrors: [imageUploadErrors.EMPTY_FILE]});
    }

    if(!this.state.mainImageErrors.length) {
      this.setState({requestPending: true});
      var data = new FormData();
      data.append('token', this.props.store.user.token);
      data.append('mainImage', this.state.mainImage[0]);
      data.append('isReference', false);
      self.setState({mainImageErrors: []});

      HTTPService.post("/api/upload/image", data, (status, response) => {
        console.log(response);

        new Promise((resolve, reject) => {
          if(response.success) {
            if(self.state.addComment == '') {
              resolve('success');
            }
            else {
              HTTPService.post("/api/content/comment", {
                token: this.props.store.user.token,
                content_id: response.content_id,
                addComment: this.state.addComment,
              }, (status, response) => {
                if(response.success) {
                  resolve('success');
                }
                else {
                  reject(response.errors.token);
                }
              })
            }
          }
          else {
            reject(response.errors.token);
          }
        }).then(function(value) {
          setTimeout(function() {
            self.props.store.modal.hideModal(self.modalName);
            location.reload();
          }.bind(this), 500);
        }, function(errors) {
          self.setState({mainImageErrors: [...response.errors.mainImage, ...errors]});
        });
      }, function(progressEvent) {
        self.setState({
          mainImageProgress: Math.round( (progressEvent.loaded * 100) / progressEvent.total )
        });
      });
    }
  }

  onDrop(image) {
    this.setState({
      mainImage: image
    });
    this.setState({mainImageErrors: initialState.mainImageErrors});
  }

  onDropRejected(rejectedImage) {
    let mainImageErrors = []

    if(rejectedImage[0].size > (globalConfig.imageUpload.maxFileSizeInBytes)) {
      mainImageErrors.push(imageUploadErrors.LIMIT_FILE_SIZE);
    }
    if(!_.includes(globalConfig.imageUpload.allowedFileTypes, path.extname(rejectedImage[0].name))) {
      mainImageErrors.push(imageUploadErrors.BAD_FILETYPE);
    }

    this.setState({mainImageErrors: mainImageErrors});
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
                  <Dropzone multiple={false}
                  accept={globalConfig.imageUpload.allowedFileTypes.join()}
                  maxSize={globalConfig.imageUpload.maxFileSizeInBytes}
                  onDrop={this.onDrop.bind(this)}
                  onDropRejected={this.onDropRejected.bind(this)}
                  className={"uploadImage__dropzone"}
                  activeClassName={"dropzone--active"}
                  acceptClassName={"dropzone--accept"}
                  rejectClassName={"dropzone--reject"}
                  disabledClassName={"dropzone--disabled"}>
                    <p>
                      Try dropping some files here, or click to select files to upload.<br/><br/>
                      <span><strong>Max filesize:</strong> 1MB</span><br/>
                      <span>
                        <strong>Supported formats:</strong>
                        {globalConfig.imageUpload.allowedFileTypes.map(function(fileType, index){
                          if(index == (globalConfig.imageUpload.allowedFileTypes.length - 1))
                            return (<span key={'filetype-' + index}> and {fileType}</span>);
                          else
                            return (<span key={'filetype-' + index}> {fileType},</span>);
                        })}
                      </span>
                    </p>
                  </Dropzone>
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
                              <span>{bytesToSize((this.state.mainImageProgress * this.state.mainImage[0].size) / 100, false, 2, 2)}</span> / <span>{bytesToSize(this.state.mainImage[0].size, true, 2, 2)}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </BS.Col>
                  </BS.Row>
                </div>
              )}
              <div {...classes('addComment', {'open': this.state.addCommentOpen})} >
                <BS.FormGroup className controlId="addComment">
                  <BS.FormControl
                    disabled={this.state.requestPending}
                    onClick={() => this.setState({addCommentOpen: true})}
                    onChange={e => this.setState({addComment: e.target.value })}
                    value={this.state.addComment} placeholder={this.state.addCommentOpen ? 'enter comment' : 'click or press c to enter comment'} componentClass="textarea"  />
                </BS.FormGroup>
              </div>

              <p>By uploading a file you agree to the terms and conditions of 4fickr. Otherwise you will be punished and arrested in guantanamo bay.</p>
              <BS.HelpBlock bsClass={'text-danger'}>
                {this.state.mainImageErrors.map(function(error, index){
                  return <div key={ index }>● {error}</div>;
                })}
              </BS.HelpBlock>
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
