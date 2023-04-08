import { message } from 'antd'
import { makeAutoObservable } from 'mobx'
import React from 'react'
import { Template } from '../../../../models/template'
import { Storage } from '../../../../shared/storage'
import { stores } from '../../../../stores'
import { ChatBalance, MessageShortcutKey } from '../../../../types'
import { homeStore } from '../../store'

export class Store {
  constructor() {
    makeAutoObservable(this, {
      inputRef: false,
    })
  }

  inputRef = React.createRef<HTMLTextAreaElement>()

  value = ''
  isCompositionStarted = false

  get messageShortcutKey() {
    return stores.config.config.setting.messageShortcutKey
  }

  focus = () => {
    this.inputRef.current?.focus()
  }

  onChangeMessageShortcutKey = (messageShortcutKey: MessageShortcutKey) => {
    stores.config.config.setting.messageShortcutKey = messageShortcutKey
    stores.config.flushDb()
  }

  onSubmit = () => {
    try {
      if (this.value.trim() === '') return
      homeStore.conversation?.sendNewMessage(this.value.trim())
      this.value = ''
    } catch (err: any) {
      message.info(err.message)
    }
  }

  onValueChange = (value: string) => {
    this.value = value
    if (this.value === '/') {
      this.showPanel()
    } else {
      this.panelVisible = false
    }
  }

  showPanel = () => {
    if (this.templates.length === 0) this.templates = Storage.getTemplates()
    if (this.templates.length === 0) return
    this.templateIndex = 0
    this.panelVisible = true
  }

  hidePanel = () => {
    this.panelVisible = false
  }

  panelVisible = false

  templates: Template[] = []

  templateIndex = 0

  onArrowKey = (key: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => {
    if (!this.panelVisible) return

    const step = key === 'ArrowUp' || key === 'ArrowDown' ? 2 : 1
    if (key === 'ArrowUp' || key === 'ArrowLeft') {
      this.templateIndex -= step
    } else {
      this.templateIndex += step
    }

    if (this.templateIndex < 0) {
      this.templateIndex = this.templates.length - 1
    }
    if (this.templateIndex >= this.templates.length) {
      this.templateIndex = 0
    }
  }

  onEscape = () => {
    if (this.panelVisible) this.panelVisible = false
    else this.value = ''
  }

  useTemplate = (template: Template) => {
    this.value = template.template
    this.panelVisible = false
    this.focus()
  }

  onOpenSetting = async () => {
    this.panelVisible = false
    const conversation = homeStore.conversation
    if (!conversation) return
    conversation.openSetting()
  }

  onClearMessages = () => {
    this.onValueChange('')
    homeStore.conversation?.clearMessages()
  }

  onSetBalance = (balance: ChatBalance) => {
    this.onValueChange('')
    homeStore.conversation?.setBalance(balance)
  }
}

