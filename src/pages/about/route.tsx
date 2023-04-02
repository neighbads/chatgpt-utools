import { RouteObject } from 'oh-router'
import { Page } from '.'
import { navigate, Options } from '../../router'

export const aboutRoute: RouteObject = {
  path: '/about',
  element: <Page />,
}

export function toAbout(opts?: Options) {
  navigate('/about', opts)
}

