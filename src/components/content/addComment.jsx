import React from 'react';
import FontAwesome from "react-fontawesome";
import HTTPService from 'utils/HTTPService';
import * as BS from 'react-bootstrap';
import { inject } from 'mobx-react';
import _ from 'lodash';
import path from 'path';

import Comment from 'components/content/comment';

import globalConfig from 'configs/global.js';
import {
  imageUpload as imageUploadErrors,
  content as contentErrors,
} from 'constants/errorCodes';

const initialState = {
  addComment: '',
  addCommentClicked: false,
  addCommentReply: [],
  addCommentErrors: [],
  addCommentImage: {},
  addCommentImageErrors: [],
  addCommentImageRequestPending: false
};

@inject('store')
export default class AddComment extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  submit(e) {
    var self = this;
    e.preventDefault();

    const commentLengthAccepted = (this.state.addComment.replace(/[\n\r\t\s]/g, "").length >= globalConfig.comment.minLength) &&
                            (this.state.addComment.replace(/[\n\r\t\s]/g, "").length <= globalConfig.comment.maxLength);

    if(commentLengthAccepted) {
      this.setState({
        addCommentErrors: initialState.addCommentErrors,
        addCommentImageErrors: initialState.addCommentImageErrors
      })
      if(_.isEmpty(self.state.addCommentImage)) {
        this.submitComment.bind(this)();
      }
      else {
        this.setState({addCommentImageRequestPending: true});
        this.submitImage.bind(this)();
      }
    }
    else {
      this.setState({addCommentErrors: [contentErrors.COMMENT_LENGTH]})
    }
  }

  submitComment(contentRef) {
    console.log("SUBMIT");
    var self = this;
    //console.log(this.state.addCommentReply);
    let replys = [];

    if(!_.isEmpty(this.state.addCommentReply)) {
      if(this.state.addCommentReply.replys.length > 0) {
        this.props.addCommentReply.replys.map(function(reply) {
          replys.push(reply._id)
        })
      }
      replys.push(this.state.addCommentReply._id);
    }

    HTTPService.post("/api/content/comment", {
      token: this.props.store.user.token,
      content_id: this.props.contentID,
      contentRef: contentRef,
      addComment: this.state.addComment,
      addCommentReplys: replys,
    }, (status, response) => {
      if(response.success) {
        self.setState(initialState);
        self.props.refreshComments(response.comments);
      }
      else {
        self.setState({addCommentErrors: response.errors.comment});
      }
    })
  }

  submitImage() {
    var self = this;
    var data = new FormData();

    data.append('token', self.props.store.user.token);
    data.append('mainImage', self.state.addCommentImage[0]);
    data.append('isReference', true);

    HTTPService.post("/api/upload/image", data, (status, response) => {
      console.log("--- IMAGE ---");
      console.log(response);
      if(response.success) {
        self.submitComment(response.content_id);
      }
      else {
        self.setState({
          addCommentImageErrors: response.errors
        });
      }
    });
  }

  render() {
    console.log("RENDER")
    //console.log(this.state.addCommentReply);
    const {
      contentClass,
      removeReply,
    } = this.props;
    //console.log(this.state.addCommentReply);
    const isAddCommentOpen = (this.state.addCommentClicked || !_.isEmpty(this.state.addCommentReply));

    return (
      <div { ...contentClass('addComment', {'open': isAddCommentOpen}) } onClick={() => this.setState({addCommentClicked: true})}>
        {_.isEmpty(this.state.addCommentReply) ? (null) : (
          <Comment
            reply={true}
            comment={this.state.addCommentReply}
            removeReply={removeReply}
          />
        )}

        <form onSubmit={this.submit.bind(this)}>
          <BS.FormGroup className controlId="addComment">
            <BS.FormControl
              onClick={() => this.setState({addCommentOpen: true})}
              onChange={e => this.setState({addComment: e.target.value })}
              value={this.state.addComment} placeholder={this.state.addCommentOpen ? 'enter comment' : 'click or press c to enter comment'} componentClass="textarea"  />
          </BS.FormGroup>
          <BS.Row>
            <BS.Col lg={10} md={10} sm={10} xs={8} >
              {_.isEmpty(this.state.addCommentImage) ? (
                <div>
                  <label htmlFor="commentImage" className="btn btn-action btn-sm">Select an image</label>
                  <input name="commentImage" id="commentImage" type="file" onChange={ (e) => this.handleCommentFileCange(e.target.files) } />
                </div>
              ) : (
                <div>
                  {this.state.addCommentImageRequestPending ? (null) : (
                      <a {...contentClass('removeImage')}  onClick={() => { this.setState({addCommentImage: {}}); }}>
                        <span>{this.state.addCommentImage[0].name}</span>
                        <FontAwesome name='times' />
                      </a>
                    )
                  }
                </div>
              )}
            </BS.Col>
            <BS.Col lg={2} md={2} sm={2} xs={4}>
              {this.state.addCommentImageRequestPending ? (
                <BS.Button type="submit" bsStyle="primary" bsSize="small" style={{width: '100%'}} onClick={() => this.setState({addCommentOpen: true})}>
                  <FontAwesome name='spinner' spin />
                </BS.Button>
              ) : (
                <BS.Button type="submit" bsStyle="primary" bsSize="small" style={{width: '100%'}} onClick={() => this.setState({addCommentOpen: true})}>
                  Submit
                </BS.Button>
                )
              }
            </BS.Col>
          </BS.Row>
          <div>
            <BS.HelpBlock>
              {[...this.state.addCommentErrors, ...this.state.addCommentImageErrors].map(function(error, index){
                return <div key={ index }>● {error}</div>;
              })}
            </BS.HelpBlock>
          </div>
        </form>
      </div>
    );
  }

  componentWillReceiveProps(nextprops) {
    if(!_.isEqual(this.props.addCommentReply, nextprops.addCommentReply)) {
      this.setState({addCommentReply: nextprops.addCommentReply});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.state, nextState)
  }

  handleCommentFileCange(selectedFiles) {
    let addCommentImageErrors = []

    if(selectedFiles[0].size > (globalConfig.imageUpload.maxFileSizeInBytes)) {
      addCommentImageErrors.push(imageUploadErrors.LIMIT_FILE_SIZE);
    }
    if(!_.includes(globalConfig.imageUpload.allowedFileTypes, path.extname(selectedFiles[0].name))) {
      addCommentImageErrors.push(imageUploadErrors.BAD_FILETYPE);
    }

    if(addCommentImageErrors.length) {
      this.setState({
        addCommentImageErrors: addCommentImageErrors
      });
    }
    else {
      this.setState({
        addCommentImage: selectedFiles,
        addCommentImageErrors: initialState.addCommentImageErrors
      });
    }
  }
}
