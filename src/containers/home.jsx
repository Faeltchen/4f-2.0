import React from 'react';
import * as BS from 'react-bootstrap';

import Navigation from "components/navigation";
import Wall from "components/wall";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        <Navigation store={this.props.store}/>
        <Wall />
      </div>
    );
  }
}

export default Home;
