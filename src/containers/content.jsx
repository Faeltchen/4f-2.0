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

import Navigation from 'components/navigation';
import AddComment from 'components/content/addComment';
import Comment from 'components/content/comment';

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

const initialState = {
  content: {},
  contentRequestPending: true,
  mainImageFullScreen: false,
  comments: [],
  addCommentReply: [],
  addCommentFocusOnClick: false,
};

configureAnchors({offset: -60, scrollDuration: 200});

@inject('store')
@observer
export default class Content extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState;
    this.contentRequest = this.contentRequest.bind(this);
    this.contentRequest(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.id !== nextProps.match.params.id) {
      this.setState(initialState)
      this.contentRequest(nextProps.match.params.id);
    }
  }

  contentRequest(contentID) {
    console.log("--- CONTENT REQUEST ---");
    var self = this;

    HTTPService.post('/api/content/' + contentID, {
    }, (status, response) => {
      self.setState({
        content: response.content,
        comments: response.comments
      });
    }, function(progressEvent) {});
  }

  /*
  shouldComponentUpdate(nextProps, nextState) {

  }
  */

  render() {
    var self = this;
    var mainImage = {};
    console.log(this.state.comments);

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

    return (
      <div>
        <Navigation />
        {_.isEmpty(this.state.content) ? (null) : (

          <div {...contentClass()}>

            {mainImage}

            <BS.Grid>

              {/*----------- META -----------*/}
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

              {/*----------- COMMENT BOX -----------*/}
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

                        {/*----------- ADD COMMENT -----------*/}
                        <div ref={(el) => { this.addCommentRef = el; }}>
                          <AddComment
                            contentID={ this.props.match.params.id }
                            contentClass={ contentClass }
                            refreshComments={ (commentsFromResponse) => self.setState({ comments: commentsFromResponse }) }
                            addCommentReply={ this.state.addCommentReply }
                            removeReply={ () =>  self.setState({addCommentReply: initialState.addCommentReply}) }
                          />
                        </div>

                      </div>
                    ) : null}
                  </div>
                </BS.Col>
              </BS.Row>

              {/*----------- ALL COMMENTS -----------*/}
              {_.isEmpty(this.state.comments) ? (null) : (
                <div {...contentClass('commentSection', '')}>
                  {this.state.comments.map((comment, index) => {
                    const isCommentLinked = (window.location.hash && window.location.hash == '#comment-'+comment._id)

                    return (
                      <BS.Row key={index}>
                        <BS.Col lg={7} md={8} className={'col-center'}>
                          {isCommentLinked ?
                             <ScrollableAnchor id={'comment-'+comment._id}>
                              <div></div>
                             </ScrollableAnchor>
                           : null}
                          <Comment comment={comment} linked={isCommentLinked ? true : false} onClick={this.addReply.bind(this, comment)} />
                        </BS.Col>
                      </BS.Row>
                    )
                  })}
                </div>
              )}
              <div ref={ (el) => { this.bottomPageRef = el; } }></div>
            </BS.Grid>
          </div>
        )}
      </div>
    );
  }

  addReply(comment) {
    /*
    console.log("---");
    console.log(comment);
    if(typeof comment.replys == "undefined") {
      comment.replys = [];
    }
    */

    this.setState({
      addCommentReply: comment,
    });
    this.addCommentRef.scrollIntoView();
  }
}
