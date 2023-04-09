import { makeAutoObservable } from 'mobx'
import { openInput } from '../../components/popups/input'
import { Conversation } from '../../models/conversation'
import { Storage } from '../../shared/storage'
import { stores } from '../../stores'
import { IgnoreType } from '../../types'
import { Store as ConversationsStore } from './components/conversations/store'
import { Store as InputStore } from './components/inputArea/store'
import { Store as RecommendTopicStore } from './components/recommendTopic/store'
import { IQuery } from './route'

export const homeStore = new (class {
  stores = {
    input: new InputStore(),
    recommendTopic: new RecommendTopicStore(),
    conversations: new ConversationsStore(),
  }

  constructor() {
    makeAutoObservable(this)
  }

  onShow = () => {
    if (
      stores.chat.conversations.length === 0 ||
      !Storage.getIgnore(IgnoreType.system, 'welcome')
    ) {
      Storage.setIgnore(IgnoreType.system, 'welcome')
      this.createHelperConversation()
    }
  }

  inputAreaHeight = 125

  conversation?: Conversation

  conversationsOpen = true

  toggleConversationOpen = () => {
    this.conversationsOpen = !this.conversationsOpen
  }

  setConversationOpen = (open: boolean) => {
    this.conversationsOpen = open
  }

  setConversation = (conversation: Conversation | string) => {
    if (typeof conversation === 'string') {
      const _conversation = stores.chat.conversations.find(
        (c) => c.id === conversation
      )
      if (!_conversation) return
      this.conversation = _conversation
    } else {
      this.conversation = conversation
    }
    this.conversation.init()
    this.stores.input.focus()
    this.stores.input.hidePanel()
  }

  createConversation = () => {
    const conversation = stores.chat.createConversation()
    this.setConversation(conversation)
  }

  createHelperConversation = () => {
    const conversation = stores.chat.createHelperConversation()
    this.setConversation(conversation)
  }

  removeConversation = (conversation?: Conversation) => {
    if (!conversation) return
    if (this.conversation === conversation) {
      this.conversation = undefined
    }
    stores.chat.removeConversation(conversation)
  }

  changeConversationTitle = async (conversation?: Conversation) => {
    if (!conversation) return
    const name = await openInput({
      title: '请输入新的会话名称',
      defaultValue: conversation.name,
    })
    if (!name) return
    conversation.name = name
    conversation.flushDb()
  }

  onQueryChange = (query: IQuery) => {
    if (query.text) {
      homeStore.createConversation()
      homeStore.conversation?.sendNewMessage(query.text)
    } else if (query.conversationId) {
      this.setConversation(query.conversationId)
      // TODO: 会话列表滚动到对应位置
      if (query.messageId) {
        // TODO: 消息列表滚动到对应位置
      }
    } else if (query.new) {
      this.createConversation()
    }
  }

  destory = () => {
    this.conversation = undefined
  }
})()

