import { RouteObject } from 'oh-router'
import { Page } from '.'
import { navigate, Options } from '../../router'

export type IQuery = {
  text?: string
  conversationId?: string
  messageId?: string
}

export const homeRoute: RouteObject = {
  path: '/',
  element: <Page />,
}

export function toHome(opts?: Options<IQuery>) {
  navigate('/', opts)
}

