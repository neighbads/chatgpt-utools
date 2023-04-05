import { makeAutoObservable } from 'mobx'
import { Store as BasicStore } from './basic/store'
import { Store as OtherStore } from './other/store'
import { Store as ProxyStore } from './proxy/store'

export class Store {
  stores = {
    basic: new BasicStore(),
    other: new OtherStore(),
    proxy: new ProxyStore(),
  }

  constructor() {
    makeAutoObservable(this)
  }
}

