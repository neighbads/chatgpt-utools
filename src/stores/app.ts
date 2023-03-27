import { makeAutoObservable } from 'mobx'
import { version } from '../../package.json'
import { openUpdate } from '../components/popups/update'
import { Storage } from '../shared/storage'

export const appStore = new (class {
  theme: 'light' | 'dark' = 'light'

  get isDark() {
    return this.theme === 'dark'
  }

  constructor() {
    makeAutoObservable(this)
    this.setTheme(Storage.getTheme())
    this.checkUpdate()
  }

  openApiKeyUrl = () => {
    utools.shellOpenExternal('https://platform.openai.com/account/api-keys')
  }

  openShareUrl = () => {
    utools.shellOpenExternal(
      'https://github.com/lblblong/mossgpt-utools/issues/4'
    )
  }

  setTheme = (theme: 'light' | 'dark' | 'auto') => {
    if (theme === 'auto') {
      Storage.removeTheme()
      theme = utools.isDarkColors() ? 'dark' : 'light'
    } else {
      Storage.setTheme(theme)
    }

    this.theme = theme
    if (theme === 'dark') {
      document.body.classList.add('dartTheme')
    } else {
      document.body.classList.remove('dartTheme')
    }
  }

  checkUpdate = async (force = false) => {
    const res = await fetch(
      'https://api.github.com/repos/lblblong/mossgpt-utools/releases/latest'
    )
    const {
      tag_name,
      body,
      html_url,
    }: { tag_name?: string; body: string; html_url: string } =
      (await res.json()) || {}
    if (!tag_name) return false
    if (tag_name.endsWith(version)) return false
    const ignore = Storage.getVersionIgnore(tag_name)
    if (ignore && !force) return false

    setTimeout(() => {
      openUpdate({
        newVersion: tag_name,
        description: body,
        onIgnore() {
          Storage.setVersionIgnore(tag_name)
        },
        onUpdate() {
          utools.shellOpenExternal(html_url)
        },
      })
    }, 600)
    return true
  }
})()

