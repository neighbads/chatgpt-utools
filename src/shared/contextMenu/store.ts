import { MenuDirection } from '@szhsin/react-menu'
import { makeAutoObservable } from 'mobx'
import { ReactNode } from 'react'

interface IMenuItem {
  label: string
  icon?: ReactNode
  onClick?: () => void
}

export const ContextMenu = new (class {
  constructor() {
    makeAutoObservable(this)
  }

  state: 'open' | 'closed' = 'closed'
  direction: MenuDirection = 'right'
  anchorPoint?: {
    x: number
    y: number
  }

  items: IMenuItem[] = []

  open = (opts: {
    event: React.MouseEvent
    items: IMenuItem[]
    direction?: MenuDirection
  }) => {
    this.anchorPoint = {
      x: opts.event.clientX,
      y: opts.event.clientY,
    }
    this.direction = opts.direction ?? 'right'
    this.items = opts.items
    this.state = 'open'
  }

  close = () => {
    this.state = 'closed'
  }
})()

