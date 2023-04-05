import { ConfigProvider, theme } from 'antd'
import { Observer } from 'mobx-react-lite'
import { ManagerProvider } from 'oh-popup-react'
import { RouterView } from 'oh-router-react'
import ReactDOM from 'react-dom/client'
import { router } from './router'
import { ContextMenuView } from './shared/contextMenu'
import { setup } from './shared/core'
import { popupManager } from './shared/popupManager'
import { stores } from './stores'

setup()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Observer>
    {() => (
      <ConfigProvider
        theme={{
          token: {
            marginLG: 16,
            colorPrimary: '#1890ff',
          },
          algorithm:
            stores.app.theme === 'dark'
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
        }}
      >
        <ContextMenuView />
        <ManagerProvider manager={popupManager} />
        <RouterView router={router} />
      </ConfigProvider>
    )}
  </Observer>
)

