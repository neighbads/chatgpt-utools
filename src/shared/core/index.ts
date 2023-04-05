import { configure } from 'mobx'
import 'oh-popup-react/dist/style.css'
import '../../assets/css/index.scss'
import '../../assets/css/var.css'
import { registerHooks } from '../registerHooks'
import { registerKeyboard } from '../registerKeyboard'
import { update } from '../update'

export const setup = () => {
  configure({ enforceActions: 'never' })
  update()
  registerHooks()
  registerKeyboard()
}

