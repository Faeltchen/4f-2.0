import {observable, action} from "mobx";

export default class ModalStore {
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
