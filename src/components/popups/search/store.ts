import Fuse from 'fuse.js'
import { makeAutoObservable } from 'mobx'
import { stores } from '../../../stores'
import { toHome } from '../../../pages/home/route'
import { FuseDoc, FuseItem } from './type'

export const searchStore = new (class {
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
    const index = Fuse.createIndex(opts.keys, docs)
    this.fuse = new Fuse<FuseDoc>(docs, opts, index)
  }

  search = () => {
    if (!this.fuse) this.init()
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
    if (it.type === 'conversation') {
      toHome({
        query: {
          conversationId: it.id,
        },
      })
    }
  }
})()

