import { isNil, objectPick } from '@libeilong/func'
import { message } from 'antd'
import { makeAutoObservable, toJS } from 'mobx'
import { DefaultConfig } from '../constance'
import { toSetting } from '../pages/setting/route'
import { filterSameValue } from '../shared/func/filterSameValue'
import { Storage } from '../shared/storage'
import { IConfig } from '../types'

export class ConfigStore {
  constructor() {
    this.apiKey = Storage.getApiKey()
    this.config = Storage.getConfig()
    makeAutoObservable(this)
  }

  apiKey: string
  config: IConfig

  checkApiKey = async () => {
    if (!this.apiKey) {
      message.info('检测到您还未设置 API Key，请先设置 API Key')
      toSetting()
      // 通过空 Promise 来阻止后续的操作
      return new Promise(() => {})
    }
  }

  flushDb = () => {
    const config = objectPick(
      toJS(this.config),
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

    const setting = filterSameValue(
      DefaultConfig.setting,
      objectPick(toJS(this.config.setting), 'all', {
        filter: (val) => {
          return !isNil(val) && val !== ''
        },
      })
    )

    Storage.setConfig({
      ...config,
      setting,
    })
    Storage.setApiKey(this.apiKey)
  }
}

