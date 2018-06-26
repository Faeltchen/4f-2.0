import React from 'react';
import * as BS from 'react-bootstrap';
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { hot } from 'react-hot-loader';
import axios from 'axios';
import HTTPService from 'utils/HTTPService';

import Home from "containers/home";

class App extends React.Component {

  constructor(props) {
    super(props);

    var self = this;
    if(this.props.store.user.token) {
      HTTPService.post("/api/user/authenticate", {
        token: self.props.store.user.token,
      }, (status, response) => {
        if(response.success) {
          console.log("=> AUTHENTIFICATED AS " + response.user.role);
          self.props.store.user.setUser(response.user);
        }
        else {
          console.log("=> AUTHENTIFICATION FAILED");
          self.props.store.user.setToken("");
          self.props.store.user.setUser({});
        }
      });
    }
  }

  render() {
    console.log("--- App Store ---");
    console.log(this.props.store.user);
    console.log(this.props.store.modal);
    console.log(this.props.store.content);
    console.log("-----------------");

    return(
      <div>
        <Home store={this.props.store}/>
      </div>
    );
  }
}

if(module.hot) {
  module.hot.accept();
}
export default App;
