import { message } from 'antd'
import { makeAutoObservable } from 'mobx'
import React from 'react'
import { Template } from '../../../../models/template'
import { Storage } from '../../../../shared/storage'
import { homeStore } from '../../store'
import { MessageShortcutKey } from '../../../../types'

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
      this.showTemplates()
    } else {
      this.templateVisible = false
    }
  }

  showTemplates = () => {
    if (this.templates.length === 0) this.templates = Storage.getTemplates()
    if (this.templates.length === 0) return
    this.templateIndex = 0
    this.templateVisible = true
  }

  templateVisible = false

  templates: Template[] = []

  templateIndex = 0

  onArrowKey = (key: 'ArrowUp' | 'ArrowDown') => {
    if (key === 'ArrowUp') {
      this.templateIndex = this.templateIndex - 1
    } else {
      this.templateIndex = this.templateIndex + 1
    }
    if (this.templateIndex < 0) {
      this.templateIndex = this.templates.length - 1
    }
    if (this.templateIndex >= this.templates.length) {
      this.templateIndex = 0
    }
  }

  onEscape = () => {
    if (this.templateVisible) this.templateVisible = false
    else this.value = ''
  }

  useTemplate = (template: Template) => {
    this.value = template.template
    this.templateVisible = false
    this.focus()
  }
}

