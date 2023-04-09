import { Button } from 'antd'
import { useController } from 'oh-popup-react'
import { FC } from 'react'
import { withObserver } from '../../../shared/func/withObserver'
import { popupManager } from '../../../shared/popupManager'
import { Markdown } from '../../markdown'
import styles from './index.module.scss'

interface Props {
  data: string
}

const Notice: FC<Props> = ({ data }) => {
  const ctl = useController()

  return withObserver(() => (
    <div className={styles.index}>
      <div className={styles.header}>通知</div>
      <div>
        <Markdown>{data}</Markdown>
      </div>
      <div className={styles.footer}>
        <Button size="small" type="primary" onClick={() => ctl.close()}>
          知道了
        </Button>
      </div>
    </div>
  ))
}

export function openNotice(props: Props) {
  return popupManager.open({
    el: <Notice {...props} />,
    position: 'center',
  })
}

