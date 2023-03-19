import { ControlOutlined } from '@ant-design/icons'
import { useStore } from '@libeilong/react-store-provider'
import { AutoComplete, Button, Col, Form, Input, InputNumber, Row } from 'antd'
import { Models } from '../../../constance'
import { withObserver } from '../../../shared/func/withObserver'
import { appStore } from '../../../stores/app'
import { Store } from '../store'

export function BasicSetting() {
  const root = useStore<Store>()
  const store = root.stores.basic

  return withObserver(() => (
    <Form layout="vertical">
      <Form.Item
        label={
          <span>
            API_KEY (
            {
              [
                <Button
                  size="small"
                  type="link"
                  onClick={appStore.openApiKeyUrl}
                >
                  重新获取API_KEY
                </Button>,
              ][store.currentLink]
            }
            )
          </span>
        }
      >
        <Input.Password
          value={root.baseConfig.apiKey}
          onChange={({ target }) => (root.baseConfig.apiKey = target.value)}
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="模型">
            <AutoComplete
              value={root.baseConfig.model}
              options={Models.map((it) => {
                return {
                  label: it,
                  value: it,
                }
              })}
              defaultValue={Models[0]}
              onChange={(val) => (root.baseConfig.model = val)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Max Tokens">
            <InputNumber
              min={1}
              max={4090}
              value={root.baseConfig.max_tokens}
              onChange={(value) => {
                root.baseConfig.max_tokens = value ?? undefined
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Prompt"
        tooltip="用于指定对话要开始的话题或上下文，它可以帮助 AI 更好地理解和回应用户的输入。"
      >
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 5 }}
          value={root.baseConfig.prompt}
          onChange={({ target }) => (root.baseConfig.prompt = target.value)}
        />
      </Form.Item>

      {store.restConfig && (
        <>
          <Form.Item
            label="API_URL"
            tooltip="适用于使用自建的反向代理服务器，示例：https://api.my-openai.com"
          >
            <Input
              value={root.baseConfig.apiBaseUrl}
              onChange={({ target }) =>
                (root.baseConfig.apiBaseUrl = target.value)
              }
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={5}>
              <Form.Item label="temperature">
                <InputNumber
                  min={0}
                  max={2}
                  step={0.1}
                  value={root.baseConfig.temperature}
                  onChange={(value) => {
                    root.baseConfig.temperature = value ?? undefined
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="top_p">
                <InputNumber
                  min={0}
                  max={1}
                  step={0.1}
                  value={root.baseConfig.top_p}
                  onChange={(value) => {
                    root.baseConfig.top_p = value ?? undefined
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="presence_penalty">
                <InputNumber
                  min={-2}
                  max={2}
                  step={0.1}
                  value={root.baseConfig.presence_penalty}
                  onChange={(value) => {
                    root.baseConfig.presence_penalty = value ?? undefined
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="frequency_penalty">
                <InputNumber
                  min={-2}
                  max={2}
                  step={0.1}
                  value={root.baseConfig.frequency_penalty}
                  onChange={(value) => {
                    root.baseConfig.frequency_penalty = value ?? undefined
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}

      <Form.Item>
        <Button type="primary" onClick={root.saveBaseConfig}>
          保存
        </Button>
        {!store.restConfig && (
          <Button
            type="link"
            icon={<ControlOutlined />}
            onClick={() => (store.restConfig = true)}
          >
            高级配置
          </Button>
        )}
      </Form.Item>
    </Form>
  ))
}

