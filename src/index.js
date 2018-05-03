import React from 'react';
import ReactDOM from 'react-dom';

import App from "./App";
import Store from './store/index'

import "./styles/_bootstrap.scss";

const store = new Store();

ReactDOM.render(
  <App store={store}/>,
  document.getElementById('root')
);
