import { ChatMessage } from '@libeilong/chatgpt'
import { makeAutoObservable } from 'mobx'
import { openTextArea } from '../components/popups/textarea'
import { Storage } from '../shared/storage'

export type MessageState = 'sending' | 'fail' | 'done'

export class Message implements ChatMessage {
  id!: string
  text!: string
  createdAt!: number
  role!: 'user' | 'assistant'
  state: MessageState = 'sending'
  failedReason?: string
  parentMessageId?: string
  conversationId!: string
  deletedAt?: number

  get self() {
    return this.role === 'user'
  }

  get isDeleted() {
    return this.deletedAt !== undefined
  }

  get isWaiting() {
    return this.state === 'sending' && this.isDeleted === false
  }

  constructor(
    opts: Pick<
      Message,
      | 'text'
      | 'createdAt'
      | 'role'
      | 'state'
      | 'conversationId'
      | 'parentMessageId'
      | 'failedReason'
    > & { id?: string }
  ) {
    if (opts.id && opts.state === 'sending') {
      opts.state = 'fail'
      opts.failedReason = '意外退出'
    }
    const id =
      opts.id || `${opts.conversationId}-${opts.createdAt}-${opts.role}`
    Object.assign(this, { ...opts, id })

    makeAutoObservable(this)
  }

  flushDb = () => {
    if (this.isDeleted) {
      Storage.removeMessage(this.id)
    } else {
      Storage.setMessage(this)
    }
    return this
  }

  onModifyText = async () => {
    const text = await openTextArea({
      title: '修改消息内容',
      defaultValue: this.text,
    })
    if (text) {
      this.text = text
      this.flushDb()
    }
  }
}

