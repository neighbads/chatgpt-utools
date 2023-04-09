import { ChatGPTAPI, SendMessageOptions } from '@libeilong/chatgpt'
import { objectPick } from '@libeilong/func'
import { makeAutoObservable } from 'mobx'
import { Storage } from '../shared/storage'
import { ChatBalance } from '../types'
import { stores } from './'

export class ChatgptStore {
  constructor() {
    makeAutoObservable(this, {
      client: false,
    })
  }

  client?: ChatGPTAPI

  init = async () => {
    if (this.client) return

    const apiKey = stores.config.apiKey
    const config = stores.config.config

    const completionParams = objectPick(config, [
      'model',
      'temperature',
      'top_p',
      'presence_penalty',
      'frequency_penalty',
    ])

    this.client = window.preload.getChatGPTClient({
      apiKey,
      apiBaseUrl: config.apiBaseUrl,
      completionParams: completionParams,
      maxModelTokens: config.max_tokens,
      proxy: config.proxy?.open ? config.proxy : undefined,
      getMessageById: async (id: string) => {
        const message = Storage.getMessage(id).toJSON()
        // 当消息发送失败时，message.text 为空，此时使用 failedReason 作为消息内容
        if (message.state === 'fail' && message.text === '') {
          message.text = message.failedReason || ''
        }
        return message
      },
    })
  }

  reset = () => {
    this.client = undefined
  }

  sendMessage = async (
    text: string,
    opts: SendMessageOptions & { balance?: ChatBalance } = {}
  ) => {
    this.init()
    const balanceOptions = this.getBalanceOptions(
      opts.balance ?? ChatBalance.balance
    )

    opts.completionParams = Object.assign(
      {},
      opts.completionParams,
      balanceOptions
    )

    return this.client?.sendMessage(text, opts)
  }

  getBalanceOptions = (balance: ChatBalance) => {
    if (balance === ChatBalance.balance) {
      return {}
    } else if (balance === ChatBalance.creation) {
      return {
        temperature: 1.3,
      }
    } else {
      return {
        temperature: 0.5,
      }
    }
  }

  getTitle = async (
    content: string,
    onProgress: (opts: { text: string }) => void
  ) => {
    const autoTitle = stores.config.config.setting.autoTitle
    if (!autoTitle) {
      onProgress({ text: content.slice(0, 12) })
      return
    }

    await this.sendMessage(
      `我想让你为我写的内容起一个12个字以内的简短标题，你只需要返回标题文字，不要包含其他信息，比如内容是：“买手机看什么参数”。则你可以回复：“购机攻略”。请为这段内容起一个标题：“${content}”`,
      {
        onProgress: ({ text }) => {
          text = text.trim()
          if (!text) return
          onProgress({
            text: text.replace(/['"”“《》]/g, '') || content.slice(0, 10),
          })
        },
      }
    )
  }

  destory = () => {
    this.client = undefined
  }
}

