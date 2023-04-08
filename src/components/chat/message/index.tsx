import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { message as AntMessage } from 'antd'
import clsx from 'clsx'
import 'katex/dist/katex.min.css'
import { useObserver } from 'mobx-react-lite'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus as theme } from 'react-syntax-highlighter/dist/esm/styles/prism'
import RehypeKatex from 'rehype-katex'
import RemarkGFM from 'remark-gfm'
import RemarkMathPlugin from 'remark-math'
import { Conversation } from '../../../models/conversation'
import { Message as MessageModel } from '../../../models/message'
import { ContextMenu } from '../../../shared/contextMenu'
import { copyToClipboard } from '../../../shared/func/copyToClipboard'
import { withObserver } from '../../../shared/func/withObserver'
import { stores } from '../../../stores'
import styles from './index.module.scss'

interface Props {
  conversation: Conversation
  message: MessageModel
  onCopy: (message: MessageModel) => void
}

export const Message = (props: Props) => {
  const { message, conversation, onCopy } = props

  const text = useObserver(() => {
    if (message.state === 'fail' && message.text.length === 0) {
      return <p style={{ color: 'red' }}>{message.failedReason || ''}</p>
    }
    return message.text
  })

  return withObserver(() => (
    <div
      key={message.id}
      className={clsx(
        styles.index,
        message.self ? styles.user : styles.chatgpt,
        stores.app.isDark && styles.dark
      )}
      style={{
        justifyContent: message.self ? 'flex-end' : 'flex-start',
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
                onClick: () => onCopy(message),
              },
              {
                label: '删除消息',
                icon: <DeleteOutlined />,
                onClick: () => conversation.removeMessage(message.id),
              },
              {
                label: '修改内容',
                icon: <EditOutlined />,
                onClick: () => message.onModifyText(),
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
            remarkPlugins={[RemarkMathPlugin, RemarkGFM]}
            rehypePlugins={[RehypeKatex]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '') || []
                return !inline && match ? (
                  <div className={styles.codeBox}>
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, '')}
                      style={theme as any}
                      customStyle={{
                        borderRadius: 8,
                        background: stores.app.isDark ? '#1E1E1E' : '#24272E',
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
    </div>
  ))
}

