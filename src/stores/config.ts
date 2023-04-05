import { isNil, objectPick } from '@libeilong/func'
import { makeAutoObservable, toJS } from 'mobx'
import { DefaultConfig } from '../constance'
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

    const proxy = objectPick(
      toJS(this.config.proxy || ({} as IConfig['proxy']))!,
      ['host', 'port', 'open', 'username', 'password'],
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
      proxy,
    })
    Storage.setApiKey(this.apiKey)
  }
}

