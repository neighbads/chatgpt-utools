import { message } from 'antd'
import { makeAutoObservable } from 'mobx'
import React from 'react'
import { Template } from '../../../../models/template'
import { Storage } from '../../../../shared/storage'
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

  focus = () => {
    this.inputRef.current?.focus()
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

