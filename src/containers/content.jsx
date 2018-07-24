import React from 'react';
import BEMHelper from 'react-bem-helper';
import FontAwesome from "react-fontawesome";
import HTTPService from 'utils/HTTPService';
import { Link } from 'react-router-dom';
import * as BS from 'react-bootstrap';
import { observer, inject } from "mobx-react";
import Path from 'path';
import _ from "lodash";
import Moment from 'moment';
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor';
configureAnchors({offset: -60, scrollDuration: 200});

import Navigation from "components/navigation";
import Comment from "components/content/comment";

var contentClass = new BEMHelper('content');
var contentLinks = [
  {
    title: 'add to favorites',
    url: '/favorites',
    logInRequired: true
  },
  {
    title: 'follow user',
    url: '/follow',
    logInRequired: true
  },
  {
    title: 'home',
    url: '/home',
    logInRequired: false
  },
]

@inject('store')
@observer
export default class Content extends React.Component {

  state = {
    content: {},
    contentRequestPending: true,
    mainImageFullScreen: false,
    comments: [],
    addCommentOpen: false,
    addComment: '',
    addCommentErrors: [],
    addCommentReplys: []
  }

  constructor(props) {
    super(props);
    var self = this;

    HTTPService.post('/api/content/' + this.props.match.params.id, {
    }, (status, response) => {
      self.setState({
        content: response.content,
        comments: response.comments
      });
    }, function(progressEvent) {

    });
  }

  submitComment(e) {
    var self = this;
    e.preventDefault();

    HTTPService.post("/api/content/comment", {
      token: this.props.store.user.token,
      content_id: this.props.match.params.id,
      addComment: this.state.addComment,
      addCommentReplys: this.state.addCommentReplys,
    }, (status, response) => {
      if(response.success) {
        self.setState({
          comments: response.comments,
          addCommentErrors: [],
          addCommentOpen: false,
          addComment: '',
          addCommentReplys: [],
        });
      }
      else {
        self.setState({addCommentErrors: response.errors.comment});
      }
    })
  }

  addReply(replys) {
    this.setState({
      addCommentReplys: replys,
      addCommentOpen: true,
    });
    this.addCommentRef.scrollIntoView();
  }

  render() {
    var self = this;
    var mainImage = {};
    console.log(this.state);

    if(!_.isEmpty(this.state.content)) {
      const mainFileName = this.state.content.image.filename.replace(/\.[^/.]+$/, "");
      const mainFileExtension = (Path.extname(this.state.content.image.originalname) == '.gif') ? '.gif' : Path.extname(this.state.content.image.filename);
      const mainImagePath = '/uploads/' + this.state.content.image.path + '/' + mainFileName + mainFileExtension;

      mainImage = (
        <div {...contentClass('image', {'fullScreen': this.state.mainImageFullScreen})}>
          <img src={mainImagePath}
          alt={this.state.content.image.originalname}
          onClick={() => this.setState({mainImageFullScreen: !this.state.mainImageFullScreen})}
          style={this.state.mainImageFullScreen ? null : {maxHeight: (window.innerHeight * 0.6) + 'px'}} />
        </div>
      );
    }

    return(
      <div>
        <Navigation />
        {_.isEmpty(this.state.content) ? (null) : (

          <div {...contentClass()}>
            {mainImage}
            <BS.Grid>
              <BS.Row>
                <BS.Col lg={7} md={8} className={'col-center'}>
                  <div {...contentClass('meta', '')}>
                    <span>{this.state.content.image.originalname}</span>&nbsp;||&nbsp;
                    <span>{this.state.content.image.width}x{this.state.content.image.height}px</span>&nbsp;||&nbsp;
                    <span>1 clicks</span>&nbsp;||&nbsp;
                    <span>0 favorites</span>
                  </div>
                </BS.Col>
              </BS.Row>
              <BS.Row>
                <BS.Col lg={7} md={8} className={'col-center'}>
                  <div {...contentClass('boxWrapper', '')}>
                    <div {...contentClass('box', '')}>

                      <div {...contentClass('statistic', '')} >
                        <div><Link to={'/user/'+this.state.content.user._id}>0</Link> <FontAwesome name='image' /></div>
                        <div><Link to={'/user/'+this.state.content.user._id}>0</Link> <FontAwesome name='video' /></div>
                        <div><Link to={'/user/'+this.state.content.user._id}>0</Link> <FontAwesome name='comments' /></div>
                        <div><Link to={'/user/'+this.state.content.user._id}>0</Link> <FontAwesome name='users' /></div>
                      </div>

                      <div {...contentClass('userName', '')}><Link to={'/user/'+this.state.content.user._id}>{this.state.content.user.name}</Link></div>
                      <div {...contentClass('date', '')}><FontAwesome name='clock'/> {Moment(this.state.content.date).lang('de').format('DD.MM.YYYY HH:mm:ss')}</div>

                      <div {...contentClass('actions', '', 'hidden-xs')}>
                        <Link to={'/user/'+this.state.content.user._id}><FontAwesome name='backward'/></Link>&nbsp;|&nbsp;
                        {contentLinks.map(function(link, index) {
                          if(!link.logInRequired || (link.logInRequired && self.props.store.user.loggedIn))
                            return (<span key={index}><Link to={link.url}>{link.title}</Link> | </span>);
                        })}
                        <Link to={'/user/'+this.state.content.user._id}><FontAwesome name='forward'/></Link>
                      </div>

                      <BS.ButtonToolbar {...contentClass('actionsMobile', '', 'visible-xs')}>
                        <BS.DropdownButton className={'btn-action'} title="Actions" id={'actionsMobile-dropdown'}>
                          {contentLinks.map(function(link, index){
                            if(!link.logInRequired || (link.logInRequired && self.props.store.user.loggedIn))
                              return (<BS.MenuItem key={index} eventKey={index}>{link.title}</BS.MenuItem>);
                          })}
                        </BS.DropdownButton>
                      </BS.ButtonToolbar>

                      <div {...contentClass('userImage', '')}>
                        <div>
                        </div>
                      </div>
                    </div>

                    {this.props.store.user.loggedIn ? (
                      <div>
                        <div {...contentClass('report', '')}>
                          burn | abuse
                        </div>
                        <div {...contentClass('addComment', {'open': this.state.addCommentOpen})} ref={(el) => { this.addCommentRef = el; }}>
                          {_.isEmpty(this.state.addCommentReplys) ? (null) : (
                            <Comment reply={true}
                            comment={_.find(this.state.comments, {_id: this.state.addCommentReplys[this.state.addCommentReplys.length - 1]})}
                            removeReply={() =>  self.setState({addCommentReplys: []})}
                            />
                          )}
                          <form onSubmit={this.submitComment.bind(this)}>
                            <BS.FormGroup className controlId="addComment">
                              <BS.FormControl
                                onClick={() => this.setState({addCommentOpen: true})}
                                onChange={e => this.setState({addComment: e.target.value })}
                                value={this.state.addComment} placeholder={this.state.addCommentOpen ? 'enter comment' : 'click or press c to enter comment'} componentClass="textarea"  />
                            </BS.FormGroup>
                            <div>
                              <BS.HelpBlock style={{float: 'left'}}>
                                {this.state.addCommentErrors.map(function(error, index){
                                  return <span key={ index }>{error}</span>;
                                })}
                              </BS.HelpBlock>
                              <BS.Button type="submit" bsStyle="primary" bsSize="small" onClick={() => this.setState({addCommentOpen: true})}>
                                Submit
                              </BS.Button>
                            </div>
                          </form>
                        </div>
                      </div>
                    ) : null}

                  </div>
                </BS.Col>
              </BS.Row>

              {_.isEmpty(this.state.comments) ? (null) : (
                <div {...contentClass('commentSection', '')}>
                  {this.state.comments.map((comment, index) => {
                    const isCommentLinked = (window.location.hash && window.location.hash == '#comment-'+comment._id)
                    return (
                      <BS.Row key={index} >
                       <BS.Col lg={7} md={8} className={'col-center'}>
                         {isCommentLinked ?
                           <ScrollableAnchor id={'comment-'+comment._id}>
                            <div></div>
                           </ScrollableAnchor>
                        : null}
                        <Comment comment={comment} linked={isCommentLinked ? true : false} onClick={this.addReply.bind(this, [...comment.replys, comment._id])} />
                       </BS.Col>
                      </BS.Row>
                    )
                  })}
                </div>
              )}
            </BS.Grid>
          </div>
        )}
      </div>
    );
  }
}
