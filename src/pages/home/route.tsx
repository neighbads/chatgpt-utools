import { RouteObject } from 'oh-router'
import { Page } from '.'
import { navigate, Options, router } from '../../router'

export type IQuery = {
  text?: string
  conversationId?: string
  messageId?: string
  new?: boolean
}

export const homeRoute: RouteObject = {
  path: '/',
  element: <Page />,
}

export function toHome(opts?: Options<IQuery>) {
  navigate('/', opts)
}

export function inHome() {
  return router.location?.pathname === homeRoute.path
}

