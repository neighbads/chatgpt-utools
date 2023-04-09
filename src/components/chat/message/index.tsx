import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import clsx from 'clsx'
import { useObserver } from 'mobx-react-lite'
import { Conversation } from '../../../models/conversation'
import { Message as MessageModel } from '../../../models/message'
import { ContextMenu } from '../../../shared/contextMenu'
import { withObserver } from '../../../shared/func/withObserver'
import { stores } from '../../../stores'
import { Markdown } from '../../markdown'
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
          <Markdown dark={stores.app.isDark}>{text}</Markdown>
        )}
      </div>
    </div>
  ))
}

