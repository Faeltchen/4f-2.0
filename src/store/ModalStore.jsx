import {set, autorun, action, observable, toJS, extendObservable} from "mobx";
import store from "store";

class ModalStore {
  @observable modals = {};
  @observable test = "asd";

  constructor(_this) {
    var modalStoreStoraged = store.get("modalStore");

    if(typeof modalStoreStoraged != "undefined") {
      this.modals = modalStoreStoraged.modals;
    }

    this.autosave();
  }

  autosave() {
    autorun(() => {
      store.set("modalStore", toJS(this));
    })
  }

  @action
  initModal(modalName) {
    if(typeof this.modals[modalName] == "undefined") {
      this.modals[modalName] = observable({
        show: false,
      });

      this.autosave();
    }
  }

  @action
  showModal(modalName) {
    set(this.modals[modalName], {show: true});
  }

  @action
  hideModal(modalName) {
    set(this.modals[modalName], {show: false});
  }
}


export default ModalStore;
