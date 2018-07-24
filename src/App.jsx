import React from 'react';
import * as BS from 'react-bootstrap';
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";
import { hot } from 'react-hot-loader';
import axios from 'axios';
import HTTPService from 'utils/HTTPService';
import { Switch, Route } from 'react-router-dom';

import Home from "containers/home";
import Content from "containers/content";

@inject('store')
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
          self.props.store.user.clearUser();
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
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/content/:id' component={Content}/>
        </Switch>
      </div>
    );
  }
}

if(module.hot) {
  module.hot.accept();
}
export default App;
