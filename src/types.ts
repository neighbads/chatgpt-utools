export interface IConfig {
  model?: string
  apiBaseUrl?: string
  prompt?: string
  max_tokens?: number
  temperature?: number
  top_p?: number
  presence_penalty?: number
  frequency_penalty?: number
  proxy?: {
    host?: string
    port?: string
    open: boolean
    username?: string
    password?: string
  }
}

export enum MessageShortcutKey {
  CtrlEnter = 'CtrlEnter',
  Enter = 'Enter',
}

export enum ChatBalance {
  balance,
  creation,
  accuracy,
}

export const ChatBalanceDict = {
  [ChatBalance.balance]: '平衡',
  [ChatBalance.creation]: '创造',
  [ChatBalance.accuracy]: '精准',
}

