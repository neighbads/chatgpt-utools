import { ChatGPTAPI, ChatGPTAPIOptions } from '@libeilong/chatgpt'
import proxy from 'https-proxy-agent'
import nodeFetch from 'node-fetch'

function getChatGPTClient(
  opts: ChatGPTAPIOptions & {
    proxy?: {
      host?: string
      port?: string | number
      username?: string
      password?: string
    }
  }
) {
  if (opts.proxy?.host && opts.proxy?.port) {
    opts.fetch = ((url: any, options = {}) => {
      let auth: string | undefined = undefined
      if (opts.proxy?.username && opts.proxy?.password) {
        auth = `${opts.proxy?.username}:${opts.proxy?.password}`
      }

      const defaultOptions = {
        agent: proxy({
          auth,
          host: opts.proxy?.host,
          port: opts.proxy?.port,
        }),
      }

      return nodeFetch(url, {
        ...defaultOptions,
        ...options,
      })
    }) as any
  }
  return new ChatGPTAPI(opts)
}

window.preload = {
  getChatGPTClient,
}

