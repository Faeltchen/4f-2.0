import React from 'react';
import * as BS from 'react-bootstrap';
import { observer } from "mobx-react";
import { Link } from 'react-router-dom';

@observer
export default class Brick extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div style={this.props.style} className={this.props.className} brick={this.props.brick}>
        {this.props.subBricks.map((brick, index) => {
          return (
            <Link to={'/content/'+brick._id} brick={this.props.brick+'-'+index}  key={'brick-'+this.props.brick+'-'+index}>
              <div style={{backgroundImage: 'url(/uploads/'+brick.image.path + '/thumb/' + brick.image.filename + ')'}} >
              </div>
            </Link>
          )
        })}
      </div>
    );
  }
}
