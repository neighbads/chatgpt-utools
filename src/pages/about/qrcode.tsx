import { FC } from 'react'

interface Props {
  src: string
}

export const Qrcode: FC<Props> = ({ src }) => {
  return (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      <img src={src} alt="" style={{ width: 260 }} />
      <p>请使用微信扫码备注 “mossgpt” 加群</p>
    </div>
  )
}

