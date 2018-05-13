import {extendObservable} from "mobx";
import store from "store";
import UserStore from "./UserStore";
import ModalStore from "./ModalStore";
import ContentStore from "./ContentStore";

export default class Store {

  constructor() {
    extendObservable(this, {
      user: new UserStore(),
      modal: new ModalStore(),
      content: new ContentStore(),
    });
  }
}
