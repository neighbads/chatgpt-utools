import { makeAutoObservable } from 'mobx'
import { openInput } from '../../components/popups/input'
import { Conversation } from '../../models/conversation'
import { stores } from '../../stores'
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
      homeStore.conversation?.sendMessage(query.text)
      return
    }

    if (query.conversationId) {
      this.setConversation(query.conversationId)
      // TODO: 会话列表滚动到对应位置
    }
    if (query.messageId) {
      // TODO: 消息列表滚动到对应位置
    }
  }

  destory = () => {
    this.conversation = undefined
  }
})()

