import { commandPanelStore } from '../../components/popups/commandPanel/store'
import { DefaultConfig, DefaultTemplates } from '../../constance'
import { Conversation } from '../../models/conversation'
import { Message } from '../../models/message'
import { Template } from '../../models/template'
import { IConfig, IgnoreType } from '../../types'
import { filterSameValue } from '../func/filterSameValue'
import { isNil } from '../func/isNil'

export class Storage {
  static getApiKey() {
    return utools.dbStorage.getItem('apiKey')
  }

  static setApiKey(key: string) {
    return utools.dbStorage.setItem('apiKey', key)
  }

  static setConversation(it: Conversation) {
    utools.dbStorage.setItem(`c-${it.id}`, it.toJSON())
    commandPanelStore.setDoc({
      id: it.id,
      text: it.name,
      type: 'conversation',
    })
  }

  static getConversations() {
    const conversations = utools.db.allDocs(`c-`)
    return conversations.map(({ value }: any) => {
      return new Conversation(value)
    })
  }

  static removeConversation(id: string) {
    utools.dbStorage.removeItem(`c-${id}`)
  }

  static getMessage(id: string) {
    return new Message(utools.dbStorage.getItem(`m-${id}`))
  }

  static setMessage(it: Message) {
    utools.dbStorage.setItem(`m-${it.id}`, it.toJSON())
    commandPanelStore.setDoc({
      id: it.id,
      text: it.text,
      type: 'message',
      conversationId: it.conversationId,
    })
  }

  static getMessagesByConversationId(id: string) {
    return utools.db.allDocs(`m-${id}`).map(({ value }) => new Message(value))
  }

  static removeMessagesByConversationId(id: string) {
    const ids = utools.db.allDocs(`m-${id}`).map((it) => it._id)
    for (const id of ids) {
      utools.db.remove(id)
    }
  }

  static removeMessage(id: string) {
    utools.dbStorage.removeItem(`m-${id}`)
  }

  static getConfig(): IConfig {
    const config = utools.dbStorage.getItem('config')
    const setting = Object.assign({}, DefaultConfig.setting, config?.setting)
    return Object.assign({}, DefaultConfig, config, { setting })
  }

  static setConfig(config: Partial<IConfig>) {
    config = filterSameValue(DefaultConfig, config)
    utools.dbStorage.setItem('config', config)
  }

  static removeConfig() {
    utools.dbStorage.removeItem('config')
  }

  static getTemplates() {
    let templates = utools.db.allDocs('t-').map((it) => it.value)
    if (templates.length === 0) {
      templates = DefaultTemplates.map((it, i) => ({
        id: Date.now() + '' + i,
        title: it.title,
        template: it.template,
        recommendTopic: it.recommendTopic,
      }))
      for (const it of templates) {
        this.setTemplate(new Template(it))
      }
    }

    return templates.map((it) => new Template(it))
  }

  static getTemplate(id: string) {
    const it = utools.dbStorage.getItem(`t-${id}`)
    return new Template(it)
  }

  static setTemplate(it: Template) {
    utools.dbStorage.setItem(`t-${it.id}`, it.toJSON())
  }

  static removeTemplate(id: string) {
    utools.dbStorage.removeItem(`t-${id}`)
  }

  static getLastDataVersion() {
    const lastDataVersion = utools.dbStorage.getItem('dataVersion')
    if (lastDataVersion === null || lastDataVersion === undefined) {
      return -1
    }
    return lastDataVersion
  }

  static setLastDataVersion(version: number) {
    utools.dbStorage.setItem('dataVersion', version)
  }

  static setTheme(theme: string) {
    utools.dbStorage.setItem('theme', theme)
  }

  static getTheme() {
    const theme = utools.dbStorage.getItem('theme')
    if (theme) return theme
    else return utools.isDarkColors() ? 'dark' : 'light'
  }

  static removeTheme() {
    utools.dbStorage.removeItem('theme')
  }

  static setIgnore(type: IgnoreType, value: string) {
    utools.dbStorage.setItem(`${type}-ignore-${value}`, true)
  }

  static getIgnore(type: IgnoreType, value: string): boolean {
    const ignore = utools.dbStorage.getItem(`${type}-ignore-${value}`)
    return isNil(ignore) ? false : true
  }
}

