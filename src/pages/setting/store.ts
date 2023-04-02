import { isNil, objectPick } from '@libeilong/func'
import { message } from 'antd'
import { makeAutoObservable, toJS } from 'mobx'
import { Storage } from '../../shared/storage'
import { chatgptStore } from '../../stores/chatgpt'
import { IConfig } from '../../types'
import { Store as BasicStore } from './basic/store'
import { Store as OtherStore } from './other/store'

export class Store {
  stores = {
    basic: new BasicStore(),
    other: new OtherStore(),
  }

  constructor() {
    makeAutoObservable(this)
    this.baseConfig = {
      ...Storage.getConfig(),
      apiKey: Storage.getApiKey(),
    }
  }

  baseConfig: IConfig & {
    apiKey: string
  }

  saveBaseConfig = () => {
    const config = objectPick(
      toJS(this.baseConfig),
      [
        'model',
        'apiBaseUrl',
        'systemMessage',
        'max_tokens',
        'temperature',
        'top_p',
        'presence_penalty',
        'frequency_penalty',
      ],
      {
        filter: (val) => {
          return !isNil(val) && val !== ''
        },
      }
    )

    const proxy = objectPick(
      toJS(this.baseConfig.proxy || ({} as IConfig['proxy']))!,
      ['host', 'port', 'open', 'username', 'password'],
      {
        filter: (val) => {
          return !isNil(val) && val !== ''
        },
      }
    )

    Storage.setConfig({
      ...config,
      proxy,
    })
    Storage.setApiKey(this.baseConfig.apiKey)
    chatgptStore.reinit()
    message.success('成功')
  }
}

