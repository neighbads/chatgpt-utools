import { useController } from 'oh-popup-react'
import { FC } from 'react'
import { withObserver } from '../../../shared/func/withObserver'
import { popupManager } from '../../../shared/popupManager'
import styles from './index.module.scss'

interface Props {
  children: React.ReactNode
}

const BasePopup: FC<Props> = ({ children }) => {
  const ctl = useController()

  return withObserver(() => <div className={styles.index}>{children}</div>)
}

export function openBasePopup(props: Props) {
  return popupManager.open({
    el: <BasePopup {...props} />,
    position: 'center',
  })
}

