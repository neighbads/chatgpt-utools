import { message } from 'antd'
import { makeAutoObservable } from 'mobx'
import React from 'react'
import { API } from '../../api'
import { openBasePopup } from '../../components/popups/basePopup'
import { Qrcode } from './qrcode'

export class Store {
  constructor() {
    makeAutoObservable(this)
  }

  openQrcode = async () => {
    try {
      message.loading('请稍等...')
      const qrcode = await API.other.getQrcode()
      openBasePopup({
        children: React.createElement(Qrcode, {
          src: qrcode,
        }),
      })
    } catch (err) {
    } finally {
      message.destroy()
    }
  }
}

