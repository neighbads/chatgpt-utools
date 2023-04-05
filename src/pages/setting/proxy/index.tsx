import { useStore } from '@libeilong/react-store-provider'
import { Button, Col, Form, Input, Radio, Row } from 'antd'
import { withObserver } from '../../../shared/func/withObserver'
import { Store } from '../store'

export function ProxySetting() {
  const root = useStore<Store>()
  const store = root.stores.proxy

  return withObserver(() => (
    <Form layout="vertical">
      <Form.Item label="状态">
        <Radio.Group
          value={store.fields.open}
          onChange={({ target }) => {
            store.fields.open = target.value
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
              disabled={!store.fields.open}
              placeholder="请输入代理 IP 地址"
              value={store.fields.host}
              onChange={({ target }) => {
                store.fields.host = target.value.split(':')[0]
                store.fields.port = target.value.split(':')[1]
                store.fields.username = undefined
                store.fields.password = undefined
              }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="端口">
            <Input
              disabled={!store.fields.open}
              placeholder="请输入端口"
              value={store.fields.port}
              onChange={({ target }) => (store.fields.port = target.value)}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="用户名">
            <Input
              disabled={!store.fields.open}
              placeholder="请输入用户名"
              value={store.fields.username}
              onChange={({ target }) => (store.fields.username = target.value)}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="密码">
            <Input
              disabled={!store.fields.open}
              placeholder="请输入密码"
              value={store.fields.password}
              onChange={({ target }) => (store.fields.password = target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" onClick={store.onSubmit}>
          保存
        </Button>
      </Form.Item>
    </Form>
  ))
}

