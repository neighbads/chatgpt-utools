import { Button, Input, Space } from 'antd'
import { useController } from 'oh-popup-react'
import { FC, useState } from 'react'
import { withObserver } from '../../../shared/func/withObserver'
import { popupManager } from '../../../shared/popupManager'
import styles from './index.module.scss'

interface Props {
  title: string
  placeholder?: string
  defaultValue?: string
}

const TextArea: FC<Props> = ({ title, placeholder, defaultValue }) => {
  const ctl = useController()
  const [value, setValue] = useState(defaultValue || '')

  return withObserver(() => (
    <div className={styles.index}>
      <div className={styles.title}>{title}</div>
      <div className={styles.input}>
        <Input.TextArea
          placeholder={placeholder}
          value={value}
          rows={8}
          onChange={({ target }) => setValue(target.value)}
          autoFocus
        />
      </div>
      <div className={styles.actions}>
        <Space>
          <Button onClick={() => ctl.onlyClose()}>取消</Button>
          <Button
            className={styles.submit}
            type="primary"
            onClick={() => ctl.close(value)}
          >
            确定
          </Button>
        </Space>
      </div>
    </div>
  ))
}

export function openTextArea(props: Props) {
  return popupManager.open({
    el: <TextArea {...props} />,
    position: 'center',
  })
}

