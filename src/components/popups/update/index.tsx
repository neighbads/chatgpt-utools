import { Alert, Button } from 'antd'
import { useController } from 'oh-popup-react'
import { FC } from 'react'
import { withObserver } from '../../../shared/func/withObserver'
import { popupManager } from '../../../shared/popupManager'
import styles from './index.module.scss'

interface Props {
  newVersion: string
  description: string
  onIgnore: () => void
  onUpdate: () => void
}

const Update: FC<Props> = ({ newVersion, description, onIgnore, onUpdate }) => {
  const ctl = useController()

  return withObserver(() => (
    <div className={styles.index}>
      <div className={styles.title}>检测到新的版本</div>
      <div className={styles.version}>{newVersion}</div>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{
          __html: description.replaceAll('\n', '<br/>'),
        }}
      ></div>
      <Alert message="下载页面上的 .upx 文件，然后拖动到 uTools 输入框即可安装更新"></Alert>
      <div className={styles.actions}>
        <Button
          onClick={() => {
            ctl.onlyClose()
            onIgnore()
          }}
        >
          忽略该版本
        </Button>
        <Button
          className={styles.submit}
          type="primary"
          onClick={() => {
            ctl.onlyClose()
            onUpdate()
          }}
        >
          前往更新
        </Button>
      </div>
    </div>
  ))
}

export function openUpdate(props: Props) {
  return popupManager.open({
    el: <Update {...props} />,
    position: 'center',
    maskClosable: false,
  })
}

