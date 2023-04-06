import { SearchOutlined } from '@ant-design/icons'
import { useController } from 'oh-popup-react'
import { useEffect } from 'react'
import { withObserver } from '../../../shared/func/withObserver'
import { popupManager } from '../../../shared/popupManager'
import styles from './index.module.scss'
import { commandPanelStore } from './store'

const CommandPanel = () => {
  const ctl = useController()

  useEffect(() => {
    commandPanelStore.init()
  }, [])

  return withObserver(() => (
    <div
      className={styles.index}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          if (commandPanelStore.keyword) {
            commandPanelStore.setKeyword('')
          } else {
            ctl.close()
          }
        }
      }}
    >
      <header>
        <div className={styles.icon}>
          <SearchOutlined />
        </div>
        <input
          placeholder="搜索任何内容"
          type="text"
          value={commandPanelStore.keyword}
          autoFocus
          onChange={(e) => {
            commandPanelStore.setKeyword(e.target.value)
          }}
        />
      </header>
      <main>
        {commandPanelStore.list.map((it, i) => {
          return (
            <div
              key={i}
              className={styles.item}
              onClick={() => {
                commandPanelStore.onItemClick(it)
                ctl.close()
              }}
            >
              <div className={styles.name}>{it.name}</div>
              {it.text && <div className={styles.text}>{it.text}</div>}
            </div>
          )
        })}
        {commandPanelStore.list.length === 0 && (
          <div className={styles.notFound}>
            <div>
              {commandPanelStore.fuse
                ? '将陆续支持模板、设置等内容搜索'
                : '正在建立索引...'}
            </div>
          </div>
        )}
      </main>
      <footer></footer>
    </div>
  ))
}

export function openCommandPanel() {
  return popupManager.open({
    el: <CommandPanel />,
    position: 'top',
    key: 'commandPanel',
  })
}

