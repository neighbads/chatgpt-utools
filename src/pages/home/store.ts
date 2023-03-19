import { makeAutoObservable } from 'mobx'
import { openInput } from '../../components/popups/input'
import { openTemplatePopup } from '../../components/popups/template'
import { Conversation } from '../../models/conversation'
import { chatStore } from '../../stores/chat'
import { Store as InputStore } from './components/inputArea/store'
import { Store as RecommendTopicStore } from './components/recommendTopic/store'

export const homeStore = new (class {
  stores = {
    input: new InputStore(),
    recommendTopic: new RecommendTopicStore(),
  }

  constructor() {
    makeAutoObservable(this)
  }

  inputAreaHeight = 108

  conversation?: Conversation

  getDefaultConversation() {
    this.conversation = chatStore.defaultConversation
    if (!this.conversation) {
      return
    }
    this.conversation.init()
  }

  setConversation = (conversation: Conversation) => {
    this.conversation = conversation
    this.conversation.init()
  }

  createConversation = () => {
    const conversation = chatStore.createConversation()
    this.setConversation(conversation)
  }

  removeConversation = (conversation?: Conversation) => {
    if (!conversation) return
    if (this.conversation === conversation) {
      this.conversation = undefined
    }
    chatStore.removeConversation(conversation)
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

  destory = () => {
    this.conversation = undefined
  }
})()

