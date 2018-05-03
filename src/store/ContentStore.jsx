import {set, autorun, decorate, decorator, action, observable, toJS, extendObservable} from "mobx";
import store from "store";

export default class ContentStore {

  constructor(_this) {

    this.autosave();
  }

  autosave() {
    autorun(() => {

    })
  }
}
