import { observable, computed, action } from "mobx";

import TodoModel from "./TodoModel";

export default class TodoListModel {
  @observable todos = [];

  @computed
  get unfinishedTodoCount() {
    return this.todos.filter(todo => !todo.finished).length;
  }

  @action
  addTodo(title) {
    this.todos.push(new TodoModel(title));
  }
}
/*
import {observable, autorun} from 'mobx';
import localStorage from 'mobx-localstorage';
//import { getObjects, addObject, deleteObject } from 'cosmicjs'
//import config from '../config'


export default class AppState {

  @observable posts = []
  @observable modals = []
  @observable is_saving = false
  @observable is_loading = false

  addPost() {
    this.is_saving = "asd";
    //localStorage.setItem('is_saving', this.is_saving);
  }

  initModal(modalName) {
    this.modals.push({
      "modalName": modalName,
      "visibility": "hidden"
    });
  }

  showModal(modalName) {
    //console.log(modalName);
    //console.log(this.modals);
  }
}
*/
