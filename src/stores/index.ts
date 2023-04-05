import { AppStore } from './app'
import { ChatStore } from './chat'
import { ChatgptStore } from './chatgpt'
import { ConfigStore } from './config'

export const stores = {
  app: new AppStore(),
  config: new ConfigStore(),
  chatgpt: new ChatgptStore(),
  chat: new ChatStore(),
}

