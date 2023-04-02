import {
  CheckOutlined,
  CommentOutlined,
  ControlOutlined,
  DeleteOutlined,
  RadarChartOutlined,
} from '@ant-design/icons'
import { transDict } from '@libeilong/func'
import { Button, Dropdown } from 'antd'
import clsx from 'clsx'
import { withObserver } from '../../../../shared/func/withObserver'
import {
  ChatBalance,
  ChatBalanceDict,
  MessageShortcutKey,
} from '../../../../types'
import { homeStore } from '../../store'
import styles from './index.module.scss'

export const InputArea = () => {
  const store = homeStore.stores.input

  const overlay = withObserver(() => {
    return (
      <div className={styles.overlay}>
        <div className={styles.promptBox}>
          {store.templates.map((it, index) => {
            return (
              <div
                className={clsx(
                  styles.item,
                  store.templateIndex === index && styles.active
                )}
                onClick={() => store.useTemplate(it)}
              >
                {it.title}
              </div>
            )
          })}
        </div>
        {homeStore.conversation && (
          <div className={styles.actionBar}>
            <Dropdown
              menu={{
                items: transDict(ChatBalanceDict).map((it) => ({
                  label: it.label,
                  key: it.value,
                })),
                onClick: ({ key }) =>
                  store.onSetBalance(key as unknown as ChatBalance),
              }}
              placement="topLeft"
            >
              <Button icon={<RadarChartOutlined />} type="text" block>
                {ChatBalanceDict[homeStore.conversation.balance]}
              </Button>
            </Dropdown>
            <Button
              icon={<DeleteOutlined />}
              type="text"
              block
              onClick={store.onClearMessages}
            >
              清空会话
            </Button>
            <Button
              title="此功能正在施工中..."
              disabled
              icon={<CommentOutlined />}
              type="text"
              block
            >
              总结会话
            </Button>

            <Button
              icon={<ControlOutlined />}
              type="text"
              block
              onClick={store.onOpenSetting}
            >
              设置
            </Button>
          </div>
        )}
      </div>
    )
  })

  return withObserver(() => (
    <Dropdown open={store.panelVisible} overlay={overlay}>
      <div className={styles.index}>
        <div className={styles.input}>
          <textarea
            ref={store.inputRef}
            value={store.value}
            onChange={({ target }) => store.onValueChange(target.value)}
            onCompositionStart={() => (store.isCompositionStarted = true)}
            onCompositionEnd={() => (store.isCompositionStarted = false)}
            onKeyDown={(event) => {
              if (store.isCompositionStarted) {
                return
              }

              if (event.key === 'Enter') {
                if (store.panelVisible) {
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
                ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(
                  event.key
                ) &&
                store.panelVisible
              ) {
                event.preventDefault()
                store.onArrowKey(event.key as any)
              } else if (event.key === 'Escape' && store.value !== '') {
                event.stopPropagation()
                store.onEscape()
              }
            }}
          />
          {store.value.length === 0 && (
            <div className={styles.placeholder}>
              键入<span className={styles.word}>/</span>
              获取消息模板、设置等更多功能
            </div>
          )}
        </div>
        {store.value.length > 0 && (
          <div className={styles.submitBox}>
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

