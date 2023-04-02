import { useStore } from '@libeilong/react-store-provider'
import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Tag,
} from 'antd'
import { ApiUrls, Models } from '../../../constance'
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
                <Button
                  size="small"
                  type="link"
                  onClick={appStore.openShareUrl}
                >
                  好耶！这些网站免费提供 ChatGPT 服务！
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
          addonAfter={
            <Button type="link" size="small" onClick={appStore.openOpenAIUsage}>
              查看用量
            </Button>
          }
        />
      </Form.Item>

      <Form.Item
        label="API URL"
        tooltip="适用于使用自建的 openai 接口代理服务，示例：https://api.my-openai.com/v1"
      >
        <AutoComplete
          value={root.baseConfig.apiBaseUrl}
          onChange={(val) => (root.baseConfig.apiBaseUrl = val)}
          options={ApiUrls.map((it) => {
            return {
              label: (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>{`${it.url} - ${it.name}`}</div>
                  {!it.needVpn && <Tag color="#87d068">无需梯子</Tag>}
                </div>
              ),
              value: it.url,
            }
          })}
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

      <Form.Item>
        <Button type="primary" onClick={root.saveBaseConfig}>
          保存
        </Button>
      </Form.Item>
    </Form>
  ))
}

