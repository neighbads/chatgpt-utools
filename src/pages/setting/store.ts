import { makeAutoObservable } from 'mobx'
import { Store as BasicStore } from './basic/store'
import { Store as OtherStore } from './other/store'

export class Store {
  stores = {
    basic: new BasicStore(),
    other: new OtherStore(),
  }

  constructor() {
    makeAutoObservable(this)
  }
}

