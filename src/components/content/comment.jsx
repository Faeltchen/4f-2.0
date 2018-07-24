import React from 'react';
import BEMHelper from 'react-bem-helper';
import FontAwesome from "react-fontawesome";
import { Link } from 'react-router-dom';
import * as BS from 'react-bootstrap';
import { observer, inject } from "mobx-react";
import Moment from 'moment';
import copy from 'copy-to-clipboard';

var classes = new BEMHelper('comment');

@inject('store')
@observer
export default class Comment extends React.Component {

  constructor(props) {
    super(props);
    console.log(this.props.comment.replys);
    this.constructQuotes = this.constructQuotes.bind(this);
    this.state = {
      anchorLinkActive: false,
      expandQuotes: false,
    }
  }

  render() {
    var self = this;
    const { comment } = this.props;
    this.blockquotes = null;

    return (
      <div {...classes('', {
        'reply': this.props.reply,
        'linked': this.props.linked
      })}>
        <div {...classes('heading', '')}>
          <div {...classes('meta', '')}>
            <span {...classes('name', '')}>
              <Link to={'/user/'+comment.user._id}>{comment.user.name}</Link>
            </span>
            <span {...classes('date', '')}>
              <FontAwesome name='clock'/> {Moment(comment.date).lang('de').format('DD.MM.YYYY HH:mm:ss')}
            </span>

            {this.props.reply ? (
              <span {...classes('actions', '')}>
                <FontAwesome name='times' onClick={this.props.removeReply}/>
              </span>
            ) : (
              <span {...classes('actions', '')}>
                <BS.OverlayTrigger placement="top" overlay={(
                  <BS.Tooltip placement="top" id="anchor-tooltip" >
                    Copy to clipboard
                  </BS.Tooltip>
                )}>
                  <FontAwesome name='anchor' onClick={() => {
                    this.setState({})
                    copy(window.location.href.split('#')[0]+'#comment-'+comment._id);
                  }}/>
                </BS.OverlayTrigger>

                {this.props.store.user.loggedIn ?
                  <BS.OverlayTrigger placement="top"overlay={(
                    <BS.Tooltip placement="top" id="reply-tooltip">
                      Reply to this comment
                    </BS.Tooltip>
                  )}>
                    <FontAwesome name='reply' onClick={this.props.onClick}/>
                  </BS.OverlayTrigger>
                : null}
              </span>
            )}

          </div>
        </div>
        <div {...classes('body', '')}>
          {comment.replys.length ? this.constructQuotes(comment.replys.length - 1) : null}
          {comment.comment}
        </div>
      </div>
    );
  }

  constructQuotes(quoteIndex) {
    console.log(quoteIndex);
    if(quoteIndex >= 0) {
      const reply = this.props.comment.replys[quoteIndex];
      this.blockquotes = (
        <blockquote>
          <div>{reply.user.name}&nbsp;@&nbsp;{Moment(reply.date).lang('de').format('DD.MM.YYYY HH:mm:ss')}</div>
          {(quoteIndex >= 1 && !this.state.expandQuotes) ? <a {...classes('more', '')} onClick={() => this.setState({expandQuotes: true})}><FontAwesome name='plus' />&nbsp;more</a> : null}
          {(quoteIndex < 1 || this.state.expandQuotes) ? this.constructQuotes(quoteIndex - 1) : null}
          <footer>{reply.comment}</footer>
        </blockquote>
      );
    }

    return this.blockquotes;
  }
}
