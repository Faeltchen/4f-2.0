import {set, autorun, decorate, decorator, action, observable, toJS, extendObservable} from "mobx";
import store from "store";

export default class ContentStore {
  @observable wall = [];

  constructor(_this) {
    var contentStoreStoraged = store.get("contentStore");

    if(typeof contentStoreStoraged != "undefined") {
      this.wall = contentStoreStoraged.wall;
    }

    this.autosave();
  }

  autosave() {
    autorun(() => {
      store.set("contentStore", toJS(this));
    })
  }

  @action
  setWall(newWallContent) {
    this.wall.replace(newWallContent);
  }
}
