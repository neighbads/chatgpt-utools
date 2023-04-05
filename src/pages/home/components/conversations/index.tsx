import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, Space, Tooltip } from 'antd'
import clsx from 'clsx'
import { useRef } from 'react'
import { Item, Menu, useContextMenu } from 'react-contexify'
import 'react-contexify/ReactContexify.css'
import { Scrollbars } from 'react-custom-scrollbars'
import { Conversation } from '../../../../models/conversation'
import { withObserver } from '../../../../shared/func/withObserver'
import { stores } from '../../../../stores'
import { homeStore } from '../../store'
import styles from './index.module.scss'

export const Conversations = () => {
  const store = homeStore.stores.conversations
  const conversationRef = useRef<Conversation>()
  const { show } = useContextMenu({
    id: 'conversationMenu',
  })

  return withObserver(() => (
    <div className={styles.index}>
      <div className={clsx(styles.header)}>
        <Space size={6}>
          <Input
            value={store.keyword}
            onChange={({ target }) => {
              store.setKeyword(target.value)
            }}
            className={styles.input}
            placeholder="搜索会话"
          />
          <Tooltip title="Ctrl + T" placement="right">
            <Button
              className={styles.button}
              icon={<PlusOutlined />}
              onClick={homeStore.createConversation}
            ></Button>
          </Tooltip>
        </Space>
      </div>
      <Scrollbars
        autoHide
        className={styles.list}
        renderThumbVertical={(props) => (
          <div {...props} className="scrollbar" />
        )}
      >
        {store.renderConversations.map((it) => {
          return (
            <div
              key={it.id}
              className={clsx(
                styles.item,
                it === homeStore.conversation && styles.active
              )}
              onClick={() => homeStore.setConversation(it)}
              onContextMenu={(event) => {
                conversationRef.current = it
                show({ event })
              }}
            >
              <span>{it.name}</span>
            </div>
          )
        })}
      </Scrollbars>

      <Menu id="conversationMenu" theme={stores.app.isDark ? 'dark' : 'light'}>
        <Item
          onClick={() => homeStore.removeConversation(conversationRef.current)}
        >
          <Space>
            <DeleteOutlined />
            删除会话
          </Space>
        </Item>
        <Item
          onClick={() =>
            homeStore.changeConversationTitle(conversationRef.current)
          }
        >
          <Space>
            <EditOutlined />
            修改会话名称
          </Space>
        </Item>
      </Menu>
    </div>
  ))
}

