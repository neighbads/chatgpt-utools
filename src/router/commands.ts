import { openCommandPanel } from '../components/popups/commandPanel'
import { inHome } from '../pages/home/route'
import { homeStore } from '../pages/home/store'
import { stores } from '../stores'

export const routeCommands = {
  '!qrcode': () => {
    stores.app.openQrcode()
  },
  '!qrcodePay': () => {
    stores.app.openQrcodePay()
  },
  '!toggleConversationOpen': () => {
    if (inHome()) homeStore.toggleConversationOpen()
  },
  '!openCommandPanel': () => {
    openCommandPanel()
  },
} as const

