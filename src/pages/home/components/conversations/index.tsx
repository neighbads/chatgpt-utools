import { PlusOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { useRef } from 'react'
import { Item, Menu, useContextMenu } from 'react-contexify'
import 'react-contexify/ReactContexify.css'
import { Scrollbars } from 'react-custom-scrollbars'
import { Conversation } from '../../../../models/conversation'
import { withObserver } from '../../../../shared/func/withObserver'
import { appStore } from '../../../../stores/app'
import { chatStore } from '../../../../stores/chat'
import { homeStore } from '../../store'
import styles from './index.module.scss'
import { Button, Input, Space } from 'antd'
import { useStore } from '@libeilong/react-store-provider'

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
          <Button
            className={styles.button}
            icon={<PlusOutlined />}
            onClick={homeStore.createConversation}
          ></Button>
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

      <Menu id="conversationMenu" theme={appStore.isDark ? 'dark' : 'light'}>
        <Item
          onClick={() => homeStore.removeConversation(conversationRef.current)}
        >
          删除会话
        </Item>
        <Item
          onClick={() =>
            homeStore.changeConversationTitle(conversationRef.current)
          }
        >
          修改会话名称
        </Item>
      </Menu>
    </div>
  ))
}

