import { makeAutoObservable } from 'mobx'
import { Storage } from '../shared/storage'
import { chatgptStore } from '../stores/chatgpt'
import { Message } from './message'

export class Conversation {
  id: string
  messages: Message[] = []
  name: string
  createdAt: number
  updatedAt: number

  constructor(opts?: {
    id?: string
    name?: string
    createdAt?: number
    updatedAt?: number
  }) {
    this.id = opts?.id || Date.now() + ''
    this.name = opts?.name || '新会话'
    this.createdAt = opts?.createdAt || Date.now()
    this.updatedAt = opts?.updatedAt || opts?.createdAt || Date.now()

    makeAutoObservable(this)
  }

  private initialized = false

  get lastMessage() {
    return this.messages[this.messages.length - 1] as Message | undefined
  }

  init = () => {
    if (this.initialized) return
    this.messages = Storage.getMessagesByConversationId(this.id)
    this.initialized = true
  }

  check = () => {
    if (!this.lastMessage) return
    if (this.lastMessage.state === 'sending') {
      throw Error('请等待上一条消息回复完成')
    } else if (this.lastMessage.state === 'fail') {
      this.resendMessage()
      throw Error('请等待上一条消息回复完成')
    }
  }

  generateTitle = async (text: string) => {
    await chatgptStore.getTitle(text, ({ text }) => {
      text = text.trim()
      if (!text) return
      this.name = text
    })
    this.flushDb()
  }

  private _sendMessage = async (
    lastMessage: Message,
    responseMessage: Message
  ) => {
    this.updatedAt = Date.now()
    this.flushDb()
    try {
      const { prompt } = Storage.getConfig()

      await chatgptStore.sendMessage(lastMessage.text, {
        parentMessageId: lastMessage.parentMessageId,
        messageId: lastMessage.id,
        systemMessage: prompt?.trim() !== '' ? prompt?.trim() : undefined,
        onProgress: ({ text }) => {
          text = text.trim()
          if (!text || !responseMessage.isWaiting) return
          responseMessage.text = text
          responseMessage.flushDb()
        },
      })
      responseMessage.state = 'done'

      if (this.messages.length === 2 && this.name === '新会话') {
        this.generateTitle(lastMessage.text)
      }
    } catch (err: any) {
      if (responseMessage.state === 'done') return
      responseMessage.state = 'fail'
      responseMessage.failedReason = err.message
    } finally {
      responseMessage.flushDb()
    }
  }

  sendMessage = async (text: string) => {
    const lastMessage = this.lastMessage
    const now = Date.now()
    const userMessage = new Message({
      role: 'user',
      text,
      createdAt: now,
      state: 'done',
      conversationId: this.id,
      parentMessageId: lastMessage?.id,
    }).flushDb()
    let responseMessage = new Message({
      role: 'assistant',
      text: '',
      createdAt: now + 1,
      state: 'sending',
      parentMessageId: userMessage.id,
      conversationId: this.id,
    }).flushDb()
    this.messages.push(userMessage, responseMessage)
    this._sendMessage(userMessage, responseMessage)
  }

  resendMessage = async () => {
    let lastMessage = this.messages[this.messages.length - 2]
    let responseMessage = this.messages[this.messages.length - 1]
    if (lastMessage === undefined) {
      lastMessage = responseMessage
      responseMessage = new Message({
        role: 'assistant',
        state: 'sending',
        text: '',
        createdAt: Date.now(),
        parentMessageId: lastMessage.id,
        conversationId: this.id,
      })
      this.messages.push(responseMessage)
    } else {
      responseMessage.state = 'sending'
      responseMessage.text = ''
      responseMessage.createdAt = Date.now()
      responseMessage.failedReason = undefined
    }

    responseMessage.flushDb()
    this._sendMessage(lastMessage, responseMessage)
  }

  stopMessage = () => {
    const responseMessage = this.messages[this.messages.length - 1]
    if (responseMessage?.isWaiting) {
      if (responseMessage.text === '') {
        responseMessage.text = '中断回复'
      }
      responseMessage.state = 'done'
      responseMessage.flushDb()
    }
  }

  /**
   * 删除指定位置消息，并把父子关系转移到下一条消息
   * @param index
   */
  removeMessage = (index: number) => {
    const message = this.messages[index]
    const nextMessage = this.messages[index + 1]
    if (nextMessage) {
      nextMessage.parentMessageId = message.parentMessageId
      nextMessage.flushDb()
    }
    message.deletedAt = Date.now()
    message.flushDb()
    this.messages.splice(index, 1)
  }

  flushDb = () => {
    Storage.setConversation(this)
    return this
  }
}

