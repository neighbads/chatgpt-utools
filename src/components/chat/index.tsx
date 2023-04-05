import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { message as AntMessage, Button } from 'antd'
import clsx from 'clsx'
import 'katex/dist/katex.min.css'
import { FC, ReactNode, useLayoutEffect, useRef } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus as theme } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeKatex from 'rehype-katex'
import RemarkMathPlugin from 'remark-math'
import { Message } from '../../models/message'
import { ContextMenu } from '../../shared/contextMenu'
import { copyToClipboard } from '../../shared/func/copyToClipboard'
import { withObserver } from '../../shared/func/withObserver'
import { stores } from '../../stores'
import styles from './index.module.scss'

type _Message = Pick<
  Message,
  'self' | 'id' | 'state' | 'text' | 'createdAt' | 'failedReason' | 'role'
>

type ChatMessage = _Message | { role: 'system'; text: string }

interface ChatProps {
  messages: ChatMessage[]
  onRetry?: (message: ChatMessage) => void
  onDel?: (id: string) => void
  onModifyText?: (id: string) => void
}

export const Chat: FC<ChatProps> = (props) => {
  const { messages, onRetry, onDel, onModifyText } = props
  const scrollRef = useRef<Scrollbars>(null)
  const recordRef = useRef({
    first: true,
    lastMessageLength: messages.length,
  })

  const handleCopy = (message: _Message) => {
    const selectionText = window.getSelection()?.toString()
    if (selectionText?.trim()) {
      copyToClipboard(selectionText?.trim())
      AntMessage.success('已复制到剪贴板')
      return
    }

    copyToClipboard(message.text || '')
    AntMessage.success('已复制到剪贴板')
  }

  useLayoutEffect(() => {
    const record = recordRef.current
    const scroll = scrollRef.current
    if (!scroll) return

    if (record.first) {
      record.first = false
      scroll.scrollToBottom()
    } else {
      if (record.lastMessageLength < messages.length) {
        record.lastMessageLength = messages.length
        scroll.scrollToBottom()
      } else {
        const clientHeight = scroll.getClientHeight()
        const scrollTop = scroll.getScrollTop()
        const scrollHeight = scroll.getScrollHeight()
        if (scrollHeight - clientHeight - scrollTop < 80) {
          scroll.scrollToBottom()
        }
      }
    }
  }, [messages])

  return withObserver(() => (
    <Scrollbars
      ref={scrollRef}
      autoHide
      className={clsx(styles.index, stores.app.isDark && styles.dark)}
      renderThumbVertical={(props) => <div {...props} className="scrollbar" />}
    >
      <div className={styles.container} id="chat-container">
        {messages.map((message, i) => {
          if (message.role === 'system') {
            return (
              <div className={styles.systemMessage} key={i}>
                {message.text}
              </div>
            )
          }

          let text: string | ReactNode = message.text
          if (message.state === 'fail' && message.text.length === 0) {
            text = <p style={{ color: 'red' }}>{message.failedReason || ''}</p>
          }
          return (
            <div
              key={message.id}
              className={clsx(
                styles.item,
                message.self ? styles.user : styles.chatgpt
              )}
              style={{
                alignItems: message.self ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                className={styles.bubble}
                onContextMenu={(event) => {
                  ContextMenu.open({
                    event,
                    items: [
                      {
                        label: '复制内容',
                        icon: <CopyOutlined />,
                        onClick: () => handleCopy(message),
                      },
                      {
                        label: '删除消息',
                        icon: <DeleteOutlined />,
                        onClick: () => onDel && onDel(message.id),
                      },
                      {
                        label: '修改内容',
                        icon: <EditOutlined />,
                        onClick: () => onModifyText && onModifyText(message.id),
                      },
                    ],
                  })
                }}
              >
                {typeof text !== 'string' ? (
                  text
                ) : text === '' ? (
                  <p>
                    <SyncOutlined spin />
                  </p>
                ) : message.self ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<p>${text.replace(/[\r\n]/g, '<br>')}</p>`,
                    }}
                  ></div>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[RemarkMathPlugin]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match =
                          /language-(\w+)/.exec(className || '') || []
                        return !inline && match ? (
                          <div className={styles.codeBox}>
                            <SyntaxHighlighter
                              children={String(children).replace(/\n$/, '')}
                              style={theme as any}
                              customStyle={{
                                borderRadius: 8,
                                background: stores.app.isDark
                                  ? '#1E1E1E'
                                  : '#24272E',
                              }}
                              language={match[1] || 'javascript'}
                              PreTag="div"
                              {...props}
                            />
                            <div
                              className={styles.copyBtn}
                              onClick={async () => {
                                try {
                                  await copyToClipboard(String(children).trim())
                                  AntMessage.success('复制成功')
                                } catch (err: any) {
                                  AntMessage.error(err.message)
                                }
                              }}
                            >
                              <CopyOutlined />
                            </div>
                          </div>
                        ) : (
                          <span
                            className={clsx(className, styles.inlineCode)}
                            {...props}
                          >
                            {children}
                          </span>
                        )
                      },
                    }}
                  >
                    {text}
                  </ReactMarkdown>
                )}
              </div>
              <div className={styles.footerBar}>
                {messages.length === i + 1 && !message.self && (
                  <Button
                    disabled={message.state === 'sending'}
                    type="link"
                    size="small"
                    onClick={() => onRetry && onRetry(message)}
                    style={{
                      fontSize: 12,
                    }}
                    icon={<ReloadOutlined />}
                  >
                    重新生成
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Scrollbars>
  ))
}

