import { message } from 'antd'
import { makeAutoObservable } from 'mobx'
import React from 'react'
import { openConversationSetting } from '../../../../components/popups/conversationSetting'
import { Template } from '../../../../models/template'
import { Storage } from '../../../../shared/storage'
import { ChatBalance, MessageShortcutKey } from '../../../../types'
import { homeStore } from '../../store'

export class Store {
  constructor() {
    this.messageShortcutKey = Storage.getMessageShortcutKey()
    makeAutoObservable(this, {
      inputRef: false,
    })
  }

  messageShortcutKey: MessageShortcutKey

  inputRef = React.createRef<HTMLTextAreaElement>()

  value = ''
  isCompositionStarted = false

  focus = () => {
    this.inputRef.current?.focus()
  }

  onChangeMessageShortcutKey = (messageShortcutKey: MessageShortcutKey) => {
    this.messageShortcutKey = messageShortcutKey
    Storage.setMessageShortcutKey(messageShortcutKey)
  }

  onSubmit = () => {
    try {
      if (this.value.trim() === '') return
      homeStore.conversation?.check()
      homeStore.conversation?.sendMessage(this.value.trim())
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
    const newConfig = await openConversationSetting({
      name: conversation.name,
      systemMessage: conversation.systemMessage,
    })
    Object.assign(conversation, newConfig)
    conversation.flushDb()
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

