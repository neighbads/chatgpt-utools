import { makeAutoObservable } from 'mobx'
import semver from 'semver'
import { version } from '../../package.json'
import { API } from '../api'
import { openNotice } from '../components/popups/notice'
import { openUpdate } from '../components/popups/update'
import { Storage } from '../shared/storage'
import { IgnoreType } from '../types'

export const appStore = new (class {
  theme: 'light' | 'dark' = 'light'

  get isDark() {
    return this.theme === 'dark'
  }

  constructor() {
    makeAutoObservable(this)
    this.init()
  }

  init = async () => {
    this.setTheme(Storage.getTheme())
    const update = await this.checkUpdate()
    if (!update) this.checkNotice()
  }

  openApiKeyUrl = () => {
    utools.shellOpenExternal('https://platform.openai.com/account/api-keys')
  }

  openShareUrl = () => {
    utools.shellOpenExternal(
      'https://github.com/lblblong/mossgpt-utools/issues/4'
    )
  }

  openProxyShareUrl = () => {
    utools.shellOpenExternal(
      'https://github.com/lblblong/mossgpt-utools/issues/53'
    )
  }

  openGitHub = () => {
    utools.shellOpenExternal('https://github.com/lblblong/mossgpt-utools')
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
    if (!tag_name || semver.valid(tag_name) === null) return false
    if (semver.gte(tag_name, version)) return false
    const ignore = Storage.getIgnore(IgnoreType.version, tag_name)
    if (ignore && !force) return false

    setTimeout(() => {
      openUpdate({
        newVersion: tag_name,
        description: body,
        onIgnore() {
          Storage.setIgnore(IgnoreType.version, tag_name)
        },
        onUpdate() {
          utools.shellOpenExternal(html_url)
        },
      })
    }, 600)
    return true
  }

  checkNotice = async () => {
    const { id, data, version: versionLimit } = await API.other.getNotice()
    const ignore = Storage.getIgnore(IgnoreType.notice, id)
    if (ignore || !semver.satisfies(version, versionLimit)) return
    Storage.setIgnore(IgnoreType.notice, id)
    setTimeout(() => {
      openNotice({
        data,
      })
    }, 600)
  }
})()

