import { GithubFilled, WechatFilled } from '@ant-design/icons'
import { useStore, withStore } from '@libeilong/react-store-provider'
import { Button, Divider, Space } from 'antd'
import { withObserver } from '../../shared/func/withObserver'
import { stores } from '../../stores'
import styles from './index.module.scss'
import { Store } from './store'

const _Page = () => {
  const store = useStore<Store>()
  return withObserver(() => (
    <div className={styles.index}>
      <Space direction="vertical" size={18}>
        <div className={styles.title}>MossGPT</div>
        <div>没有人类的文明，毫无意义 - 《流浪地球》</div>
        <Space>
          <Button
            type="primary"
            icon={<WechatFilled />}
            onClick={store.openQrcode}
          >
            交流群
          </Button>
          <Button icon={<GithubFilled />} onClick={stores.app.openGitHub}>
            GitHub
          </Button>
        </Space>

        <Divider>使用帮助</Divider>
        <div className={styles.help}>
          <p>1. 点击左上角消息图标可收缩与展开会话列表</p>
          <p>
            2.
            右键左侧会话列表项可展开会话操作菜单、右键消息列表项可展开消息操作菜单
          </p>
          <p>3. Ctrl + P 可全局呼出命令面板、Ctrl + T 可快速创建会话</p>
        </div>

        <Divider>说明</Divider>
        <div className={styles.help}>
          <p>1. 本插件需要 OpenAI 官网生成的 API KEY 才能使用。</p>
          <p>
            2. 本插件是开源项目，数据托管于 uTools
            存储，插件本身不会以任何形式窃取使用和传播你的 API
            KEY。我们会尽量保证你的数据安全，如对此依然不放心，可自行下载源码编译。
          </p>
          <p>
            3. 本插件默认使用了 justjavac
            大佬搭建的免费代理线路，因此，你不需要额外的翻墙也可以使用。如果你觉得代理线路不稳定，可以加入交流群来学习如何免费搭建自己的代理线路。
          </p>
        </div>
      </Space>
    </div>
  ))
}

export const Page = withStore(_Page, Store)

