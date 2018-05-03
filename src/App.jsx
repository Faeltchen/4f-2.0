import React from 'react';
import * as BS from 'react-bootstrap';
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { hot } from 'react-hot-loader';

import Navigation from "./components/navigation";

class App extends React.Component {

  constructor(props) {
    super(props);
  }
  /*
  @observable newTodoTitle = "";

  handleClick() {
    this.props.data.showModal();
  }

  componentWillUpdate() {
  //  localStorage.setItem('storage', this.props.data);
  }


  @action
  handleInputChange = e => {
    this.newTodoTitle = e.target.value;
  };

  @action
  handleFormSubmit = e => {
    this.props.store.addTodo(this.newTodoTitle);
    this.newTodoTitle = "";
    e.preventDefault();
  };
  */

  render() {
    console.log("render app");
    console.log(this.props.store);
    return(

      <div>
        <Navigation store={this.props.store}/>
      </div>
    );
  }

  /*
  <form onSubmit={this.handleFormSubmit}>
    New Todo:
    <input
      type="text"
      value={this.newTodoTitle}
      onChange={this.handleInputChange}
    />
    <ul>
      {this.props.store.todos.map((todo, index) =>
        // Only do this if items have no stable IDs
        <li key={index}>
          {todo.id}
        </li>
      )};
    </ul>
    <button type="submit">Add</button>
  </form>
  <hr />
  Tasks left: {this.props.store.unfinishedTodoCount}
  */
}

if(module.hot) {
  module.hot.accept();
}
export default App;
