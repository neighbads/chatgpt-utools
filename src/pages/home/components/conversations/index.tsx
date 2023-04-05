import {
  ControlOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import '@szhsin/react-menu/dist/index.css'
import { Button, Input, Space, Tooltip } from 'antd'
import clsx from 'clsx'
import { Scrollbars } from 'react-custom-scrollbars'
import { ContextMenu } from '../../../../shared/contextMenu'
import { withObserver } from '../../../../shared/func/withObserver'
import { homeStore } from '../../store'
import styles from './index.module.scss'

export const Conversations = () => {
  const store = homeStore.stores.conversations

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
              onContextMenu={(e) => {
                e.preventDefault()
                ContextMenu.open({
                  event: e,
                  items: [
                    {
                      label: '删除会话',
                      icon: <DeleteOutlined />,
                      onClick: () => {
                        homeStore.removeConversation(it)
                      },
                    },
                    {
                      label: '修改名称',
                      icon: <EditOutlined />,
                      onClick: () => {
                        homeStore.changeConversationTitle(it)
                      },
                    },
                    {
                      label: '更多设置',
                      icon: <ControlOutlined />,
                      onClick: () => {
                        it.openSetting()
                      },
                    },
                  ],
                })
              }}
            >
              <span>{it.name}</span>
            </div>
          )
        })}
      </Scrollbars>
    </div>
  ))
}

