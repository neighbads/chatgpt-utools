import { Modal } from 'antd'
import { makeAutoObservable } from 'mobx'
import { stores } from '../../../stores'
import { IConfig } from '../../../types'
import { homeStore } from '../../home/store'

export class Store {
  constructor() {
    makeAutoObservable(this)

    const convs = utools.db.allDocs('c-').map((it) => it._id)
    const msgs = utools.db.allDocs('m-').map((it) => it._id)
    this.storage = {
      convs,
      msgs,
    }
  }

  bindChange = (name: keyof IConfig['setting'], autoSave = true) => {
    return ({ target }: { target: any }) => {
      ;(stores.config.config.setting as any)[name] = target.value
      if (autoSave) stores.config.flushDb()
    }
  }

  storage: {
    convs: string[]
    msgs: string[]
  } = {
    convs: [],
    msgs: [],
  }

  clearStorage = async () => {
    const ids = [...this.storage.convs, ...this.storage.msgs]
    if (ids.length <= 0) return
    Modal.confirm({
      title: '提示',
      content: '这将清除所有的会话和消息，确定这么做吗？',
      onOk: () => {
        stores.chat.destory()
        homeStore.destory()
        for (const id of ids) {
          utools.db.remove(id)
        }
        this.storage.convs = []
        this.storage.msgs = []
      },
    })
  }

  checkUpdate = async () => {
    let needUpdate = await stores.app.checkUpdate(true)
    if (!needUpdate)
      Modal.success({ title: '提示', content: '当前已是最新版本' })
  }
}

