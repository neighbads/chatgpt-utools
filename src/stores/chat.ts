import { makeAutoObservable } from 'mobx'
import { HelperConversation } from '../constance'
import { Conversation } from '../models/conversation'
import { mockMessages } from '../shared/func/mockMessages'
import { Storage } from '../shared/storage'

export class ChatStore {
  constructor() {
    makeAutoObservable(this)
    this.init()
  }

  private initialized = false

  init = () => {
    if (this.initialized) return
    this.conversations = Storage.getConversations()
    this.initialized = true
  }

  createHelperConversation = () => {
    const conversation = this.createConversation({
      name: HelperConversation.name,
    })
    conversation.messages = mockMessages({
      messages: HelperConversation.messages,
      conversationId: conversation.id,
    }).map((it) => it.flushDb())
    conversation.initialized = true
    return conversation
  }

  conversations: Conversation[] = []

  get sortedConversations() {
    return [...this.conversations].sort((a, b) => {
      return a.updatedAt < b.updatedAt ? 1 : -1
    })
  }

  createConversation = (
    opts?: ConstructorParameters<typeof Conversation>[0]
  ) => {
    const conversation = new Conversation(opts).flushDb()
    this.conversations.unshift(conversation)
    return conversation
  }

  removeConversation = (conversation: Conversation) => {
    this.conversations.splice(this.conversations.indexOf(conversation), 1)
    Storage.removeConversation(conversation.id)
    Storage.removeMessagesByConversationId(conversation.id)
  }

  destory = () => {
    this.initialized = false
    this.conversations = []
  }
}

