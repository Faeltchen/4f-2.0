import {action, autorun, extendObservable, toJS} from "mobx";
import store from "store";

export default function(_this) {
  autorun(() => {
    console.log( toJS(_this));
    if(typeof store.get("store") == "undefined") {
      console.log("asdasd");

    }
    else {
      console.log("exists");
      extendObservable(_this, store.get("store"));
    }

    store.set("store", toJS(_this))
  })

  /*
  if(typeof store.get("store") == "undefined") {
    console.log("asdasd");

  }
  else {
    console.log("exists");
    //extendObservable(_this, store.get("store"));
  }

  store.set("store", toJS(_this))
  */



  // will run on change
  /*
  autorun(() => {
    console.log("autorun");
    // on load check if there's an existing store on localStorage and extend the store
    if (firstRun) {
      const existingStore = store.get("store");
      console.log("existingStore");
      console.log(existingStore);

      if (existingStore) {
        extendObservable(_this, existingStore)
      }
    }

    // from then on serialize and save to localStorage
    //store.set("store", toJS(_this))
    console.log("store");
    console.log(store.get("store"));
  })

  firstRun = false
  */
}
