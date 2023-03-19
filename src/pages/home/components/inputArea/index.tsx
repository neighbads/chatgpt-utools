import { Button, Dropdown } from 'antd'
import { withObserver } from '../../../../shared/func/withObserver'
import { homeStore } from '../../store'
import styles from './index.module.scss'

export const InputArea = () => {
  const store = homeStore.stores.input

  return withObserver(() => (
    <Dropdown
      open={store.templateVisible}
      menu={{
        items: store.templates.map((it, index) => ({
          style:
            store.templateIndex === index
              ? { background: 'var(--gray-0)' }
              : {},
          key: it.id!,
          label: it.title,
          onClick: () => store.useTemplate(it),
        })),
      }}
    >
      <div className={styles.index}>
        <textarea
          placeholder={`输入 / 选择消息模板`}
          ref={store.inputRef}
          className={styles.input}
          value={store.value}
          onChange={({ target }) => store.onValueChange(target.value)}
          onCompositionStart={() => (store.isCompositionStarted = true)}
          onCompositionEnd={() => (store.isCompositionStarted = false)}
          onKeyDown={(event) => {
            if (store.isCompositionStarted) {
              return
            }
            if (event.key === 'Enter') {
              if (store.templateVisible) {
                event.preventDefault()
                store.useTemplate(store.templates[store.templateIndex])
                return
              }

              if (event.shiftKey) {
                return
              } else {
                event.preventDefault()
                store.onSubmit()
              }
            } else if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
              event.preventDefault()
              store.onArrowKey(event.key as any)
            }
          }}
        />
        {store.value.length > 0 && (
          <div className={styles.submitWrap}>
            <Button size="small" type="primary" onClick={store.onSubmit}>
              发送
            </Button>
          </div>
        )}
      </div>
    </Dropdown>
  ))
}

