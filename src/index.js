import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';

import App from "./App";
import Store from './store/index'

import "./styles/_bootstrap.scss";

const stores = {
  // Key can be whatever you want
  store: new Store(),
  // ...other stores
};

ReactDOM.render(
  <Provider {...stores}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
