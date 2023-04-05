import { SearchOutlined } from '@ant-design/icons'
import { useController } from 'oh-popup-react'
import { withObserver } from '../../../shared/func/withObserver'
import { popupManager } from '../../../shared/popupManager'
import styles from './index.module.scss'
import { searchStore } from './store'

const Search = () => {
  const ctl = useController()

  return withObserver(() => (
    <div
      className={styles.index}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          if (searchStore.keyword) {
            searchStore.setKeyword('')
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
          value={searchStore.keyword}
          autoFocus
          onChange={(e) => {
            searchStore.setKeyword(e.target.value)
          }}
        />
      </header>
      <main>
        {searchStore.list.map((it, i) => {
          return (
            <div
              key={i}
              className={styles.item}
              onClick={() => {
                searchStore.onItemClick(it)
                ctl.close()
              }}
            >
              <div className={styles.name}>{it.name}</div>
              {it.text && <div className={styles.text}>{it.text}</div>}
            </div>
          )
        })}
        {searchStore.list.length === 0 && (
          <div className={styles.notFound}>
            <div>将陆续支持模板、设置等内容搜索</div>
          </div>
        )}
      </main>
      <footer></footer>
    </div>
  ))
}

export function openSearch() {
  return popupManager.open({
    el: <Search />,
    position: 'center',
  })
}

