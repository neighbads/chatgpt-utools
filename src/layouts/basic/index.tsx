import clsx from 'clsx'
import { Outlet, useLocation } from 'oh-router-react'
import { Icon } from '../../components/icon'
import { aboutRoute, toAbout } from '../../pages/about/route'
import { homeRoute, toHome } from '../../pages/home/route'
import { toSetting } from '../../pages/setting/route'
import { templateRoute, toTemplate } from '../../pages/template/route'
import { templateFormRoute } from '../../pages/templateForm/route'
import { toTranslation, translationRoute } from '../../pages/translation/route'
import { withObserver } from '../../shared/func/withObserver'
import { stores} from '../../stores'
import styles from './index.module.scss'
import { QuestionCircleFilled } from '@ant-design/icons'

export const BasicLayout = () => {
  const location = useLocation()

  const menus = [
    {
      icon: 'chat',
      onClick: () => toHome(),
      active: location.pathname === homeRoute.path,
    },
    {
      icon: 'translation',
      onClick: () => toTranslation(),
      active: location.pathname === translationRoute.path,
    },
    {
      icon: 'template',
      onClick: () => toTemplate(),
      active: [templateRoute.path, templateFormRoute.path].includes(
        location.pathname
      ),
    },
    {
      icon: 'about',
      onClick: () => toAbout(),
      active: location.pathname === aboutRoute.path,
    },
  ]

  return withObserver(() => (
    <div className={clsx(styles.index, stores.app.isDark && styles.dark)}>
      <div className={styles.navbar}>
        <div>
          {menus.map((menu, i) => (
            <div
              className={clsx(
                styles.menu,
                menu.active ? styles.active : undefined
              )}
              onClick={() => menu.onClick()}
              key={menu.icon}
            >
              <Icon value={menu.icon} />
            </div>
          ))}
        </div>
        <div>
          <div className={styles.menu} onClick={() => toSetting()}>
            <Icon value="setting" />
          </div>
        </div>
      </div>
      <div className={styles.main}>
        <Outlet />
      </div>
    </div>
  ))
}

