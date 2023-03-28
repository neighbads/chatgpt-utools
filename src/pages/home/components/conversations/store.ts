import { makeAutoObservable } from 'mobx'
import { chatStore } from '../../../../stores/chat'

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
    return chatStore.sortedConversations.filter((it) =>
      it.name.includes(this._keyword)
    )
  }
}

