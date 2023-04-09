import { CopyOutlined } from '@ant-design/icons'
import { message } from 'antd'
import clsx from 'clsx'
import 'katex/dist/katex.min.css'
import { FC, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus as theme } from 'react-syntax-highlighter/dist/esm/styles/prism'
import RehypeKatex from 'rehype-katex'
import RemarkGFM from 'remark-gfm'
import RemarkMathPlugin from 'remark-math'
import { navigate } from '../../router'
import { copyToClipboard } from '../../shared/func/copyToClipboard'
import { stores } from '../../stores'
import styles from './index.module.scss'

interface Props {
  children: string
  dark?: boolean
}

export const Markdown: FC<Props> = ({ children, dark }) => {
  const onClick = useCallback((e: MouseEvent) => {
    const { tagName, attributes, src } = e.target as any
    switch (tagName) {
      case 'A':
        const href = attributes.href.nodeValue
        if (href.startsWith('/') || href.startsWith('!')) {
          navigate(href, {
            query: {
              t: Date.now(),
            },
          })
        } else {
          utools.shellOpenExternal(href)
        }
        break
      case 'IMG':
        // TODO: 放大预览
        break
      default:
        break
    }
  }, [])

  return (
    <div
      onClick={(e) => onClick(e.nativeEvent)}
      className={clsx(styles.index, dark && styles.dark)}
    >
      <ReactMarkdown
        remarkPlugins={[RemarkMathPlugin, RemarkGFM]}
        rehypePlugins={[RehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '') || []
            return !inline && match ? (
              <div className={styles.codeBox}>
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, '')}
                  style={theme as any}
                  customStyle={{
                    borderRadius: 8,
                    background: stores.app.isDark ? '#1E1E1E' : '#24272E',
                  }}
                  language={match[1] || 'javascript'}
                  PreTag="div"
                  {...props}
                />
                <div
                  className={styles.copyBtn}
                  onClick={async () => {
                    try {
                      await copyToClipboard(String(children).trim())
                      message.success('复制成功')
                    } catch (err: any) {
                      message.error(err.message)
                    }
                  }}
                >
                  <CopyOutlined />
                </div>
              </div>
            ) : (
              <span className={clsx(className, styles.inlineCode)} {...props}>
                {children}
              </span>
            )
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

