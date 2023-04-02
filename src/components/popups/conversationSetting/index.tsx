import { Button, Form, Input, message } from 'antd'
import { useLocalStore } from 'mobx-react-lite'
import { useController } from 'oh-popup-react'
import { FC } from 'react'
import { withObserver } from '../../../shared/func/withObserver'
import { popupManager } from '../../../shared/popupManager'
import styles from './index.module.scss'

interface Props {
  name: string
  systemMessage?: string
}

const ConversationSetting: FC<Props> = (props) => {
  const ctl = useController()
  const store = useLocalStore(() => {
    return {
      name: props.name,
      systemMessage: props.systemMessage,
      onSubmit: () => {
        try {
          if (!store.name) throw Error('标题不能为空')
          ctl.close({
            name: store.name,
            systemMessage: store.systemMessage,
          })
        } catch (err: any) {
          message.error(err.message)
        }
      },
    }
  })

  const bindChange = (key: keyof typeof store) => {
    return (e: any) => {
      ;(store as any)[key] = e.target.value
    }
  }

  return withObserver(() => (
    <div className={styles.index}>
      <div className={styles.title}>会话设置</div>
      <Form layout="vertical">
        <Form.Item label="会话名称">
          <Input
            placeholder="请输入会话名称"
            value={store.name}
            onChange={bindChange('name')}
          />
        </Form.Item>
        <Form.Item label="系统消息(System Message)">
          <Input.TextArea
            rows={3}
            placeholder="通常用于给 AI 预置身份或指定对话要开始的话题、上下文。"
            value={store.systemMessage}
            onChange={bindChange('systemMessage')}
          />
        </Form.Item>
      </Form>
      <div className={styles.actions}>
        <Button onClick={() => ctl.onlyClose()}>取消</Button>
        <Button
          className={styles.submit}
          type="primary"
          onClick={store.onSubmit}
        >
          确定
        </Button>
      </div>
    </div>
  ))
}

export function openConversationSetting(props: Props) {
  return popupManager.open({
    el: <ConversationSetting {...props} />,
    position: 'center',
  })
}

