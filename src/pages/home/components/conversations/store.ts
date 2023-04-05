import { makeAutoObservable } from 'mobx'
import { stores } from '../../../../stores'

export class Store {
  constructor() {
    makeAutoObservable(this)
  }

  keyword = ''

  _keyword = ''

  timer?: NodeJS.Timeout

  setKeyword = (keyword: string) => {
    this.keyword = keyword
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this._keyword = keyword
    }, 300)
  }

  get renderConversations() {
    return stores.chat.sortedConversations.filter((it) =>
      it.name.includes(this._keyword)
    )
  }
}

