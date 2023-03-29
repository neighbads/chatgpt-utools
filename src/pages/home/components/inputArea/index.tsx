import { CheckOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd'
import { withObserver } from '../../../../shared/func/withObserver'
import { MessageShortcutKey } from '../../../../types'
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

              if (
                (store.messageShortcutKey === 'CtrlEnter' && event.ctrlKey) ||
                (store.messageShortcutKey === 'Enter' && !event.shiftKey)
              ) {
                event.preventDefault()
                store.onSubmit()
              }
            } else if (
              ['ArrowUp', 'ArrowDown'].includes(event.key) &&
              store.templateVisible
            ) {
              event.preventDefault()
              store.onArrowKey(event.key as any)
            } else if (event.key === 'Escape' && store.value !== '') {
              event.stopPropagation()
              store.onEscape()
            }
          }}
        />
        {store.value.length > 0 && (
          <div className={styles.submitWrap}>
            <Dropdown.Button
              type="primary"
              size="small"
              style={{ width: 'auto' }}
              onClick={store.onSubmit}
              menu={{
                items: [
                  {
                    label: '按 Enter 发送',
                    key: MessageShortcutKey.Enter,
                    icon:
                      store.messageShortcutKey === MessageShortcutKey.Enter ? (
                        <CheckOutlined />
                      ) : null,
                  },
                  {
                    label: '按 Ctrl + Enter 发送',
                    key: MessageShortcutKey.CtrlEnter,
                    icon:
                      store.messageShortcutKey ===
                      MessageShortcutKey.CtrlEnter ? (
                        <CheckOutlined />
                      ) : null,
                  },
                ],
                onClick: ({ key }) =>
                  store.onChangeMessageShortcutKey(key as MessageShortcutKey),
              }}
            >
              发送
            </Dropdown.Button>
          </div>
        )}
      </div>
    </Dropdown>
  ))
}

