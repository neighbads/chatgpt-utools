import dayjs from 'dayjs'
import { makeAutoObservable } from 'mobx'
import { Storage } from '../shared/storage'
import { stores } from '../stores'
import { ChatBalance } from '../types'
import { Message } from './message'

export class Conversation {
  id: string
  messages: Message[] = []
  name: string
  createdAt: number
  updatedAt: number
  balance: ChatBalance
  systemMessage?: string

  constructor(opts?: {
    id?: string
    name?: string
    createdAt?: number
    updatedAt?: number
    balance?: ChatBalance
    systemMessage?: string
  }) {
    this.id = opts?.id ?? Date.now() + ''
    this.name = opts?.name ?? '新会话'
    this.createdAt = opts?.createdAt ?? Date.now()
    this.updatedAt = opts?.updatedAt ?? opts?.createdAt ?? Date.now()
    this.balance = opts?.balance ?? ChatBalance.balance
    this.systemMessage = opts?.systemMessage

    makeAutoObservable(this, {
      abortController: false,
    })
  }

  setBalance = (balance: ChatBalance) => {
    this.balance = balance
  }

  get renderMessages() {
    if (this.messages.length === 0) return []
    // 按时间区间插入系统消息：时间间隔超过 5 分钟
    return this.messages.reduce((res, cur) => {
      const getTime = () => {
        const today = dayjs().format('YYYY-MM-DD')
        const curDay = dayjs(cur.createdAt).format('YYYY-MM-DD')
        if (today === curDay) {
          return dayjs(cur.createdAt).format('HH:mm:ss')
        }
        return dayjs(cur.createdAt).format('YYYY-MM-DD HH:mm:ss')
      }
      const last = res[res.length - 1] as Message
      if (res.length === 0 || cur.createdAt - last.createdAt > 5 * 60 * 1000) {
        res.push({
          role: 'system',
          text: getTime(),
        })
      }

      res.push(cur)
      return res
    }, [] as (Message | { role: 'system'; text: string })[])
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
    await stores.chatgpt.getTitle(text, ({ text }) => {
      text = text.trim()
      if (!text) return
      this.name = text
    })
    this.flushDb()
  }

  abortController?: AbortController

  private _sendMessage = async (
    lastMessage: Message,
    responseMessage: Message
  ) => {
    this.abortController = new AbortController()
    this.updatedAt = Date.now()
    this.flushDb()
    try {
      const { systemMessage } = Storage.getConfig()

      await stores.chatgpt.sendMessage(lastMessage.text, {
        parentMessageId: lastMessage.parentMessageId,
        messageId: lastMessage.id,
        systemMessage: this.systemMessage ?? systemMessage,
        abortSignal: this.abortController.signal,
        balance: this.balance,
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
      if (err.name === 'AbortError') {
        if (responseMessage.text === '') {
          responseMessage.text = '中断回复'
        }
        responseMessage.state = 'done'
      } else {
        responseMessage.state = 'fail'
        responseMessage.failedReason = err.message
      }
    } finally {
      this.abortController = undefined
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
    this.abortController?.abort()
  }

  /**
   * 删除指定位置消息，并把父子关系转移到下一条消息
   * @param index
   */
  removeMessage = (id: string) => {
    const index = this.messages.findIndex((m) => m.id === id)
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

  clearMessages = () => {
    for (const message of this.messages) {
      message.remove()
    }
    this.messages = []
  }

  flushDb = () => {
    Storage.setConversation(this)
    return this
  }
}

