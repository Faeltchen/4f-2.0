import React from 'react';
import ReactDOM from 'react-dom';

import App from "./App";
import Store from './store/index'

import "./styles/_bootstrap.scss";

/*

*/

const store = new Store();

ReactDOM.render(
  <App store={store}/>,
  document.getElementById('root')
);
//console.log(process.env);
//module.hot.accept();

// App.js

/*
import React from 'react'
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader'

const App = () => <div>Hello World!</div>

export default hot(module)(App)
*/
