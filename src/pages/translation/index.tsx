import { ArrowRightOutlined, RetweetOutlined } from '@ant-design/icons'
import { Button, Checkbox, Space } from 'antd'
import { useEffect } from 'react'
import { withObserver } from '../../shared/func/withObserver'
import { useQuery } from '../../shared/hooks/useQuery'
import styles from './index.module.scss'
import { IQuery } from './route'
import { translationStore } from './store'

export function Page() {
  const query = useQuery<IQuery>()

  useEffect(() => {
    if (query.text) {
      translationStore.onSourceChange(query.text)
    }
  }, [query])

  return withObserver(() => (
    <div className={styles.index}>
      <div className={styles.sourceBox}>
        <textarea
          value={translationStore.source}
          onChange={({ target }) =>
            translationStore.onSourceChange(target.value)
          }
          placeholder="请输入要翻译的内容"
        />
      </div>

      <div className={styles.toolbarBox}>
        <div>
          {translationStore.config.sourceLang}
          <span className={styles.icon}>
            <ArrowRightOutlined />
          </span>
          {translationStore.config.targetLang}
        </div>
        <Space>
          <Button
            size="small"
            type="link"
            icon={<RetweetOutlined />}
            onClick={translationStore.reverse}
          >
            翻转
          </Button>
          <Checkbox
            checked={translationStore.autoMode}
            onChange={({ target }) =>
              translationStore.setAutoMode(target.checked)
            }
          >
            自动
          </Checkbox>
          <Button
            disabled={translationStore.autoMode}
            type="primary"
            onClick={translationStore.start}
          >
            翻译
          </Button>
        </Space>
      </div>

      <div className={styles.targetBox}>
        <div
          dangerouslySetInnerHTML={{
            __html: translationStore.target.replaceAll('\n', '<br/>'),
          }}
        ></div>
        {translationStore.err && (
          <div className={styles.err}>{translationStore.err.message}</div>
        )}
      </div>
    </div>
  ))
}

