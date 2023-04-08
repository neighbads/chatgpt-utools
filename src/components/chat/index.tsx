import { ReloadOutlined } from '@ant-design/icons'
import { message as AntMessage, Button } from 'antd'
import clsx from 'clsx'
import 'katex/dist/katex.min.css'
import { autorun } from 'mobx'
import { useObserver } from 'mobx-react-lite'
import { FC, useCallback, useLayoutEffect, useRef } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { Conversation } from '../../models/conversation'
import { Message as MessageModel } from '../../models/message'
import { copyToClipboard } from '../../shared/func/copyToClipboard'
import { withObserver } from '../../shared/func/withObserver'
import { stores } from '../../stores'
import styles from './index.module.scss'
import { Message } from './message'

interface ChatProps {
  onDel?: (id: string, index: number) => void
  onModifyText?: (id: string, index: number) => void
  conversation: Conversation
}

export const Chat: FC<ChatProps> = (props) => {
  const { conversation } = props
  const scrollRef = useRef<Scrollbars>(null)

  useLayoutEffect(() => {
    const scroll = scrollRef.current!
    let lastMessageLength = 0
    const scrollToBottom = () => {
      requestAnimationFrame(() => {
        scroll.scrollToBottom()
      })
    }

    const checkScroll = () => {
      requestAnimationFrame(() => {
        const clientHeight = scroll.getClientHeight()
        const scrollTop = scroll.getScrollTop()
        const scrollHeight = scroll.getScrollHeight()
        if (scrollHeight - clientHeight - scrollTop < 80) {
          scrollToBottom()
        }
      })
    }

    const clear = autorun(() => {
      // 通过访问响应式属性来触发 autorun
      conversation.lastMessage?.text.length
      if (lastMessageLength < conversation.messages.length) {
        lastMessageLength = conversation.messages.length
        scrollToBottom()
      } else {
        checkScroll()
      }
    })
    return () => clear()
  }, [conversation])

  const handleCopy = useCallback((message: MessageModel) => {
    const selectionText = window.getSelection()?.toString()
    if (selectionText?.trim()) {
      copyToClipboard(selectionText?.trim())
      AntMessage.success('已复制到剪贴板')
      return
    }

    copyToClipboard(message.text || '')
    AntMessage.success('已复制到剪贴板')
  }, [])

  const canRetry = useObserver(() => {
    if (conversation.messages.length < 2) return false
    if (conversation.lastMessage?.self) return false
    return true
  })

  return withObserver(() => (
    <Scrollbars
      ref={scrollRef}
      autoHide
      className={clsx(styles.index, stores.app.isDark && styles.dark)}
      renderThumbVertical={(props) => <div {...props} className="scrollbar" />}
    >
      <div className={styles.container} id="chat-container">
        {conversation.renderMessages.map((message, i) => {
          if (message.role === 'system') {
            return (
              <div className={styles.systemMessage} key={i}>
                {message.text}
              </div>
            )
          }

          return (
            <div className={styles.message} key={message.id}>
              <Message
                message={message}
                conversation={conversation}
                onCopy={handleCopy}
              />
            </div>
          )
        })}

        {canRetry && conversation.lastMessage && (
          <div className={styles.footerBar}>
            <Button
              disabled={conversation.lastMessage.state === 'sending'}
              type="link"
              size="small"
              onClick={() => {
                conversation.resendMessage({
                  index: conversation.messages.length - 2,
                })
              }}
              style={{
                fontSize: 12,
              }}
              icon={<ReloadOutlined />}
            >
              重新生成
            </Button>
          </div>
        )}
      </div>
    </Scrollbars>
  ))
}

