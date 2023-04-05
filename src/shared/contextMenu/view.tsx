import { ControlledMenu, MenuItem } from '@szhsin/react-menu'
import { Space } from 'antd'
import { withObserver } from '../func/withObserver'
import { ContextMenu } from './store'
import { stores } from '../../stores'

export const ContextMenuView = () => {
  return withObserver(() => (
    <ControlledMenu
      theming={stores.app.isDark ? 'dark' : 'light'}
      anchorPoint={ContextMenu.anchorPoint}
      state={ContextMenu.state}
      direction={ContextMenu.direction}
      onClose={() => ContextMenu.close()}
    >
      {ContextMenu.items.map((item, i) => (
        <MenuItem key={i} onClick={item.onClick}>
          <Space>
            {item.icon}
            {item.label}
          </Space>
        </MenuItem>
      ))}
    </ControlledMenu>
  ))
}

