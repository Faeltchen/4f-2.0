import {action, autorun, observable} from "mobx";

import modalStore from "./ModalStore";

autorun(() => {
  //data.is_saving = localStorage.getItem('is_saving');
});

export default class Store {
  //@observable modal = new modalStore();
  @observable test = "";

  @action
  addTest(name) {
    console.log("->"+name);
    this.test = name;
  }
  /*
  @computed
  get unfinishedTodoCount() {
    return this.todos.filter(todo => !todo.finished).length;
  }

  @action
  addTodo(title) {
    this.todos.push(new TodoModel(title));
  }
  */
}
