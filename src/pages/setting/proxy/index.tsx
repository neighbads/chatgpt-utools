import { useStore } from '@libeilong/react-store-provider'
import { Button, Col, Form, Input, Radio, Row } from 'antd'
import { withObserver } from '../../../shared/func/withObserver'
import { Store } from '../store'

export function ProxySetting() {
  const store = useStore<Store>()

  return withObserver(() => (
    <Form layout="vertical">
      <Form.Item label="状态">
        <Radio.Group
          value={store.baseConfig.proxy?.open}
          onChange={({ target }) => {
            store.baseConfig.proxy!.open = target.value
          }}
        >
          <Radio value={true}>开启</Radio>
          <Radio value={false}>关闭</Radio>
        </Radio.Group>
      </Form.Item>
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item label="代理 IP 地址">
            <Input
              disabled={!store.baseConfig.proxy?.open}
              placeholder="请输入代理 IP 地址"
              value={store.baseConfig.proxy?.host}
              onChange={({ target }) => {
                store.baseConfig.proxy!.host = target.value.split(':')[0]
                store.baseConfig.proxy!.port = target.value.split(':')[1]
                store.baseConfig.proxy!.username = undefined
                store.baseConfig.proxy!.password = undefined
              }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="端口">
            <Input
              disabled={!store.baseConfig.proxy?.open}
              placeholder="请输入端口"
              value={store.baseConfig.proxy?.port}
              onChange={({ target }) =>
                (store.baseConfig.proxy!.port = target.value)
              }
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="用户名">
            <Input
              disabled={!store.baseConfig.proxy?.open}
              placeholder="请输入用户名"
              value={store.baseConfig.proxy?.username}
              onChange={({ target }) =>
                (store.baseConfig.proxy!.username = target.value)
              }
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="密码">
            <Input
              disabled={!store.baseConfig.proxy?.open}
              placeholder="请输入密码"
              value={store.baseConfig.proxy?.password}
              onChange={({ target }) =>
                (store.baseConfig.proxy!.password = target.value)
              }
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" onClick={store.saveBaseConfig}>
          保存
        </Button>
      </Form.Item>
    </Form>
  ))
}

