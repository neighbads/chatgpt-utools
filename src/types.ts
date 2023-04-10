export interface IConfig {
  model?: string
  apiBaseUrl?: string
  systemMessage?: string
  max_tokens?: number
  temperature?: number
  top_p?: number
  presence_penalty?: number
  frequency_penalty?: number

  setting: {
    autoTranslation: boolean
    autoTitle: boolean
    textSpacing: boolean
    messageShortcutKey: MessageShortcutKey
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

export enum IgnoreType {
  version = 'version',
  notice = 'notice',
  system = 'system',
}

