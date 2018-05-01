import React from 'react';
import * as BS from 'react-bootstrap';
import localStorage from 'mobx-localstorage';
import { observable, action } from "mobx";
import { observer } from "mobx-react";

import Navigation from "./components/navigation";

export default class App extends React.Component {

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
    return(
      <div>
        <Navigation modalStore={this.props.store}/>
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
