import Fuse from 'fuse.js'
import { makeAutoObservable } from 'mobx'
import { toHome } from '../../../pages/home/route'
import { stores } from '../../../stores'
import { FuseDoc, FuseItem } from './type'

export const commandPanelStore = new (class {
  constructor() {
    makeAutoObservable(this, {
      fuse: false,
    })
  }

  keyword = ''

  timer?: NodeJS.Timeout

  setKeyword = (keyword: string) => {
    this.keyword = keyword
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      if (this.keyword === '') return
      this.search()
    }, 300)
  }

  fuse?: Fuse<FuseDoc>

  init = () => {
    if (this.fuse) return
    const convs = utools.db.allDocs('c-').map(({ value }) => {
      return {
        id: value.id,
        type: 'conversation' as const,
        text: value.name,
      }
    })
    const msgs = utools.db.allDocs('m-').map(({ value }) => {
      return {
        id: value.id,
        type: 'message' as const,
        text: value.text,
        conversationId: value.conversationId,
      }
    })
    const opts = { keys: ['text'] }
    // TODO: 模板、设置项
    const docs = [...convs, ...msgs]
    this.fuse = new Fuse<FuseDoc>(docs, opts)
  }

  removeDoc = (doc: FuseDoc) => {
    if (!this.fuse) return
    this.fuse!.remove((_doc) => {
      return _doc.type === doc.type && _doc.id === doc.id
    })
  }

  setDoc = (doc: FuseDoc) => {
    if (!this.fuse) return
    this.removeDoc(doc)
    this.fuse!.add(doc)
  }

  search = () => {
    if (!this.fuse) return
    const docs = this.fuse?.search(this.keyword) || []

    const result: FuseItem[] = []

    for (const doc of docs) {
      if (doc.item.type === 'conversation') {
        const conv = result.find((c) => c.id === doc.item.id)
        if (conv) continue
        result.push({
          id: doc.item.id,
          type: 'conversation' as const,
          name: doc.item.text,
        })
      } else {
        const conversationId = doc.item.conversationId
        const conv = result.find((c) => c.id === conversationId)
        if (!conv) {
          const conv = stores.chat.conversations.find(
            (c) => c.id === conversationId
          )
          if (conv) {
            result.push({
              id: conv.id,
              type: 'conversation' as const,
              name: conv.name,
              text: doc.item.text,
              messageId: doc.item.id,
            })
          }
          continue
        }
        if (conv.messageId) {
          result.push({
            id: conv.id,
            type: 'conversation' as const,
            name: conv.name,
            text: doc.item.text,
            messageId: doc.item.id,
          })
        } else {
          conv.text = doc.item.text
          conv.messageId = doc.item.id
        }
      }
    }

    this.list = result
  }

  list: FuseItem[] = []

  onItemClick = (it: FuseItem) => {
    console.log(it)
    if (it.type === 'conversation') {
      toHome({
        query: {
          conversationId: it.id,
        },
      })
    }
  }
})()

