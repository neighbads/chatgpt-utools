import { makeAutoObservable } from 'mobx'
import { stores } from '../../stores'

export const translationStore = new (class {
  constructor() {
    makeAutoObservable(this, {
      abortController: false,
    })
  }

  get config() {
    if (/[\u4e00-\u9fa5]/.test(this.source)) {
      return {
        targetLang: '英语',
        sourceLang: '中文',
      }
    } else {
      return {
        targetLang: '中文',
        sourceLang: '英语',
      }
    }
  }

  source = ''
  target = ''

  err?: Error

  timer?: NodeJS.Timeout

  onSourceChange = (text: string) => {
    this.abortController?.abort()
    this.source = text
    clearTimeout(this.timer)
    if (stores.config.config.setting.autoTranslation)
      this.timer = setTimeout(this.start, 1000)
  }

  abortController?: AbortController

  start = async () => {
    await stores.config.checkApiKey()
    if (this.source.trim() === '') return
    this.err = undefined
    this.abortController = new AbortController()
    try {
      const { targetLang } = this.config
      await stores.chatgpt.sendMessage(
        `下面我让你来充当翻译家，你的目标是把任何语言翻译成${targetLang}，请翻译时不要带翻译腔，而是要翻译得自然、流畅和地道，使用优美和高雅的表达方式。请翻译下面的内容：\n${this.source}`,
        {
          abortSignal: this.abortController.signal,
          onProgress: ({ text }) => {
            this.target = text
          },
        }
      )
    } catch (err: any) {
      if (err.name === 'AbortError') return
      this.err = err
    } finally {
      this.abortController = undefined
    }
  }

  reverse = () => {
    if (this.target.trim() === '') return
    this.onSourceChange(this.target)
    this.target = ''
  }

  get autoMode() {
    return stores.config.config.setting.autoTranslation
  }

  setAutoMode = (value: boolean) => {
    stores.config.config.setting.autoTranslation = value
    stores.config.flushDb()
  }
})()

