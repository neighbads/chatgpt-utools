import { Router, createHashHistory } from 'oh-router'
import qs from 'qs'
import { routeCommands } from './commands'
import { routes } from './routes'

export interface Options<Q = any, P = any> {
  query?: Q
  params?: P
  replace?: boolean
}

export const router = new Router({
  routes,
  history: createHashHistory(),
})

export function navigate(
  to: string | number,
  options?: {
    replace?: boolean
    query?: Record<string, any>
  }
) {
  if (typeof to === 'number') {
    router.navigate(to, options)
  } else {
    if (to in routeCommands) {
      return routeCommands[to as keyof typeof routeCommands]()
    }

    if (options?.query) {
      to = to + '?' + qs.stringify(options.query)
    }
    router.navigate(to, options)
  }
}

