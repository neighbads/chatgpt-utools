import { PlusOutlined } from '@ant-design/icons'
import { useStore, withStore } from '@libeilong/react-store-provider'
import { Card, FloatButton, Input, Space, Tag } from 'antd'
import { withObserver } from '../../shared/func/withObserver'
import styles from './index.module.scss'
import { Store } from './store'

function _Page() {
  const store = useStore<Store>()

  return withObserver(() => (
    <div className={styles.index}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <h2>模板配置</h2>
        <Input
          placeholder="搜索模板"
          value={store.keyword}
          onChange={({ target }) => store.setKeyword(target.value)}
        />
        {store.renderTemplates.map((it, i) => {
          return (
            <Card
              key={i}
              className={styles.item}
              size="small"
              hoverable
              onClick={() => store.onEdit(it)}
              title={it.title}
              extra={
                it.recommendTopic ? <Tag color="blue">推荐话题</Tag> : undefined
              }
            >
              {it.template}
            </Card>
          )
        })}
      </Space>
      <FloatButton
        tooltip="添加模板"
        icon={<PlusOutlined />}
        type="primary"
        onClick={store.onCreate}
      ></FloatButton>
    </div>
  ))
}

export const Page = withStore(_Page, Store)

