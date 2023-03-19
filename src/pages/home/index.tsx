import { Button, FloatButton } from 'antd'
import clsx from 'clsx'
import { useCallback, useEffect, useRef } from 'react'
import emptyImage from '../../assets/images/undraw_Online_messaging_re_qft3.png'
import { Chat } from '../../components/chat'
import { Icon } from '../../components/icon'
import { withObserver } from '../../shared/func/withObserver'
import { useQuery } from '../../shared/hooks/useQuery'
import { appStore } from '../../stores/app'
import { Conversations } from './components/conversations'
import { InputArea } from './components/inputArea'
import { RecommendTopic } from './components/recommendTopic'
import styles from './index.module.scss'
import { IQuery } from './route'
import { homeStore } from './store'

export function Page() {
  const downingRef = useRef<boolean>(false)
  const lastEventRef = useRef<MouseEvent>()
  const query = useQuery<IQuery>()

  useEffect(() => {
    homeStore.stores.recommendTopic.refreshTopics()
  }, [])

  useEffect(() => {
    if (query.text) {
      homeStore.getDefaultConversation()
      homeStore.conversation?.sendMessage(query.text)
    }
  }, [query])

  const onMove = useCallback((event: MouseEvent) => {
    if (!downingRef.current) return
    homeStore.inputAreaHeight += lastEventRef.current!.y - event.y
    lastEventRef.current = event
  }, [])

  const onMouseDown = useCallback((event: MouseEvent) => {
    lastEventRef.current = event
    document.body.classList.add('unselectable')
    downingRef.current = true
  }, [])

  const onMouseUp = useCallback((event: MouseEvent) => {
    document.body.classList.remove('unselectable')
    downingRef.current = false
  }, [])

  return withObserver(() => (
    <div className={clsx(styles.index, appStore.isDark && styles.dark)}>
      <div className={styles.conversations}>
        <Conversations />
      </div>
      <div
        className={styles.main}
        onMouseMove={(e) => onMove(e.nativeEvent)}
        onMouseUp={(e) => onMouseUp(e.nativeEvent)}
      >
        {homeStore.conversation ? (
          <>
            <div className={styles.top}>
              <Chat
                key={homeStore.conversation.id}
                messages={homeStore.conversation.messages.map((it) => {
                  return {
                    id: it.id,
                    self: it.self,
                    state: it.state,
                    text: it.text,
                    createdAt: it.createdAt,
                    failedReason: it.failedReason,
                  }
                })}
                onRetry={homeStore.conversation.resendMessage}
                onDel={homeStore.conversation.removeMessage}
                onModifyText={(index) =>
                  homeStore.conversation?.messages[index].onModifyText()
                }
              />
              {homeStore.conversation?.lastMessage?.isWaiting && (
                <Button
                  className={styles.stop}
                  icon={
                    <Icon
                      style={{
                        color: 'red',
                      }}
                      value="stop-fill"
                    />
                  }
                  onClick={homeStore.conversation.stopMessage}
                >
                  停止回复
                </Button>
              )}
              {homeStore.conversation.messages.length === 0 &&
                homeStore.stores.recommendTopic.topics.length > 0 && (
                  <div className={styles.recommendTopic}>
                    <RecommendTopic />
                  </div>
                )}
            </div>
            <div
              className={styles.bottom}
              style={{
                height: homeStore.inputAreaHeight,
              }}
            >
              <InputArea />
              <div
                onMouseDown={(e) => onMouseDown(e.nativeEvent)}
                className={styles.dragLine}
              ></div>
            </div>
          </>
        ) : (
          <div className={styles.empty}>
            <img src={emptyImage} alt="" />
            <div className={styles.tip}>请选择或创建一个新的会话</div>
            <Button
              type="primary"
              className={styles.action}
              onClick={homeStore.createConversation}
            >
              新的会话
            </Button>
          </div>
        )}
      </div>
    </div>
  ))
}

