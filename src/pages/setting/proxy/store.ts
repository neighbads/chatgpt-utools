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
    Object.assign(stores.config.config.proxy, this.fields)
    stores.config.flushDb()
    stores.chatgpt.reinit()
    message.success('成功')
  }
}

