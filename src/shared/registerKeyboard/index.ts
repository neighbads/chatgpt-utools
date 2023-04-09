import { openCommandPanel } from '../../components/popups/commandPanel'
import { inHome } from '../../pages/home/route'
import { homeStore } from '../../pages/home/store'

export function registerKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 't' && e.ctrlKey && inHome()) {
      homeStore.createConversation()
    } else if (e.key === 'p' && e.ctrlKey) {
      openCommandPanel()
    }
  })
}

