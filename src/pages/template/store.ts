import { makeAutoObservable } from 'mobx'
import { Template } from '../../models/template'
import { Storage } from '../../shared/storage'
import { toTemplateForm } from '../templateForm/route'

export class Store {
  constructor() {
    this.templates = Storage.getTemplates()
    makeAutoObservable(this)
  }

  keyword = ''

  _keyword = ''

  get renderTemplates() {
    return this.templates.filter((it) =>
      `${it.title} ${it.template}`.includes(this._keyword)
    )
  }

  timer?: NodeJS.Timeout

  setKeyword = (keyword: string) => {
    this.keyword = keyword
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this._keyword = keyword
    }, 300)
  }

  templates: Template[] = []

  onCreate = () => {
    toTemplateForm()
  }

  onEdit = (it: Template) => {
    toTemplateForm({
      query: { id: it.id! },
    })
  }
}

