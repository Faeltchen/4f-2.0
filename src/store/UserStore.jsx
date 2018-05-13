import {set, autorun, action, observable, toJS, extendObservable} from "mobx";
import store from "store";

class UserStore {
  @observable token = "";
  @observable loggedIn = false;
  @observable data = {};

  constructor(_this) {
    var userStoreStoraged = store.get("userStore");

    if(typeof userStoreStoraged != "undefined") {
      this.token = userStoreStoraged.token;
      this.loggedIn = userStoreStoraged.loggedIn;
      this.data = userStoreStoraged.data;
    }

    this.autosave();
  }

  autosave() {
    autorun(() => {
      store.set("userStore", toJS(this));
    })
  }

  @action
  setUser(userData) {
    this.loggedIn = true;
    this.data = observable(userData);
  }

  @action
  clearUser() {
    this.token = "";
    this.loggedIn = false;
    this.data = observable({});
  }

  @action
  setToken(token) {
    this.token = token;
  }
}


export default UserStore;
