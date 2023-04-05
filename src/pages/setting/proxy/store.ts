import { objectPick } from '@libeilong/func'
import { message } from 'antd'
import { makeAutoObservable } from 'mobx'
import { stores } from '../../../stores'
import { IConfig } from '../../../types'

let time: NodeJS.Timer

export class Store {
  constructor() {
    clearInterval(time)
    makeAutoObservable(this)

    this.fields = objectPick(stores.config.config.proxy, 'all')

    time = setInterval(() => {
      this.currentLink = this.currentLink === 1 ? 0 : 1
    }, 3000)
  }

  currentLink = 0

  fields: IConfig['proxy']

  onSubmit = () => {
    Object.assign(stores.config.config, this.fields)
    // stores.config.config.proxy.host = this.fields.host
    // stores.config.config.proxy.port = this.fields.port
    // stores.config.config.proxy.open = this.fields.open
    // stores.config.config.proxy.username = this.fields.username
    // stores.config.config.proxy.password = this.fields.password
    stores.config.flushDb()
    stores.chatgpt.reinit()
    message.success('成功')
  }
}

