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
import { stores } from '../../../stores'
import { Store } from '../store'

export function BasicSetting() {
  const root = useStore<Store>()
  const store = root.stores.basic

  return withObserver(() => (
    <Form layout="vertical">
      <Form.Item
        label={
          <span>
            API KEY (
            {
              [
                <Button
                  size="small"
                  type="link"
                  onClick={stores.app.openApiKeyUrl}
                >
                  重新获取API_KEY
                </Button>,
                <Button
                  size="small"
                  type="link"
                  onClick={stores.app.openShareUrl}
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
          value={store.apiKey}
          onChange={({ target }) => (store.apiKey = target.value)}
          addonAfter={
            <Button
              type="link"
              size="small"
              onClick={stores.app.openOpenAIUsage}
            >
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
          value={store.fields.apiBaseUrl}
          onChange={(val) => (store.fields.apiBaseUrl = val)}
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
        >
          <Input
            addonAfter={
              <Button
                type="link"
                size="small"
                onClick={stores.app.openOneClickDeploy}
              >
                一键部署自己的免费代理
              </Button>
            }
          ></Input>
        </AutoComplete>
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="模型">
            <AutoComplete
              value={store.fields.model}
              options={Models.map((it) => {
                return {
                  label: it,
                  value: it,
                }
              })}
              defaultValue={Models[0]}
              onChange={(val) => (store.fields.model = val)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Max Tokens">
            <InputNumber
              min={1}
              max={4090}
              value={store.fields.max_tokens}
              onChange={(value) => {
                store.fields.max_tokens = value ?? undefined
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="系统消息(System Message)"
        tooltip="通常用于给 AI 预置身份或指定对话要开始的话题、上下文。注意：会话级的配置会覆盖此默认值。"
      >
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 5 }}
          value={store.fields.systemMessage}
          onChange={({ target }) => (store.fields.systemMessage = target.value)}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={store.onSubmit}>
          保存
        </Button>
      </Form.Item>
    </Form>
  ))
}

