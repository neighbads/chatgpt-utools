import { Button, Col, Form, Input, InputNumber, Row, Space } from 'antd'
import { useLocalStore } from 'mobx-react-lite'
import { useController } from 'oh-popup-react'
import { FC } from 'react'
import { withObserver } from '../../../shared/func/withObserver'
import { popupManager } from '../../../shared/popupManager'
import styles from './index.module.scss'

interface Props {
  name: string
  temperature?: number
  top_p?: number
  presence_penalty?: number
  frequency_penalty?: number
}

const ConversationSetting: FC<Props> = (props) => {
  const store = useLocalStore(() => {
    return {
      name: props.name,
      temperature: props.temperature,
      top_p: props.top_p,
      presence_penalty: props.presence_penalty,
      frequency_penalty: props.frequency_penalty,
    }
  })

  const bindChange = (key: keyof typeof store) => {
    return (e: any) => {
      ;(store as any)[key] = e.target.value
    }
  }

  const ctl = useController()

  return withObserver(() => (
    <div className={styles.index}>
      <Space direction="vertical">
        <div>会话设置</div>
        <Input
          placeholder="标题"
          value={store.name}
          onChange={bindChange('name')}
        />
        <div className={styles.actions}>
          <Button onClick={() => ctl.onlyClose()}>取消</Button>
          <Button
            className={styles.submit}
            type="primary"
            onClick={() => ctl.close()}
          >
            确定
          </Button>
        </div>
      </Space>
    </div>
  ))
}

export function openConversationSetting(props: Props) {
  return popupManager.open({
    el: <ConversationSetting {...props} />,
    position: 'center',
  })
}

