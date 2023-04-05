import { DeleteOutlined } from '@ant-design/icons'
import { useStore } from '@libeilong/react-store-provider'
import { Button, Form, Radio, Space, Tooltip } from 'antd'
import { version } from '../../../../package.json'
import { Icon } from '../../../components/icon'
import { withObserver } from '../../../shared/func/withObserver'
import { stores } from '../../../stores'
import { Store } from '../store'
import styles from './index.module.scss'

const themes = [
  { label: '跟随系统', icon: 'computer-line', value: 'auto' as const },
  { label: '明亮模式', icon: 'sun-line', value: 'light' as const },
  { label: '夜间模式', icon: 'moon-line', value: 'dark' as const },
]

export function OtherSetting() {
  const root = useStore<Store>()
  const store = root.stores.other

  return withObserver(() => (
    <Form layout="vertical" className={styles.index}>
      <Form.Item label="主题" className={styles.theme}>
        <Space size={18}>
          {themes.map((it) => {
            return (
              <Tooltip title={it.label} key={it.value}>
                <span
                  className={styles.icon}
                  onClick={() => stores.app.setTheme(it.value)}
                >
                  <Icon value={it.icon} />
                </span>
              </Tooltip>
            )
          })}
        </Space>
      </Form.Item>

      <Form.Item label="缓存">
        <span>
          {store.storage.convs.length} 个会话、{store.storage.msgs.length}{' '}
          条消息
        </span>
        <Button
          onClick={store.clearStorage}
          icon={<DeleteOutlined />}
          type="link"
        >
          清除缓存
        </Button>
      </Form.Item>

      <Form.Item
        label="自动起会话标题"
        tooltip="开启此项将会产生对话以外的 Token 消耗"
      >
        <Radio.Group
          value={stores.config.config.setting.autoTitle}
          onChange={store.bindChange('autoTitle')}
        >
          <Radio value={true}>开启</Radio>
          <Radio value={false}>关闭</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="盘古之白（优化文本可读性）"
        tooltip="在中英文、符号与数字之间增加空格，这将优化文本的可读性。注意：此功能可能会影响 Markdown 与代码的排版，请确认你的使用场景后选择是否开启。"
      >
        <Radio.Group
          value={stores.config.config.setting.textSpacing}
          onChange={store.bindChange('textSpacing')}
        >
          <Radio value={true}>开启</Radio>
          <Radio value={false}>关闭</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label={`当前插件版本：v${version}`}>
        <Button onClick={store.checkUpdate}>检查更新</Button>
      </Form.Item>
    </Form>
  ))
}

