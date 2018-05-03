import {autorun, decorate, decorator, action, observable, toJS, extendObservable} from "mobx";
import store from "store";
import autosave from "./autosave";
import ModalStore from "./ModalStore";
import ContentStore from "./ContentStore";

export default class Store {

  constructor() {

    extendObservable(this, {
       modal: new ModalStore(),
       content: new ContentStore(),
    });
  }
}
