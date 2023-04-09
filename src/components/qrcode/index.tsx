import { FC } from 'react'

interface Props {
  src: string
  text?: string
}

export const Qrcode: FC<Props> = ({ src, text }) => {
  return (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      <img src={src} alt="" style={{ width: 260 }} />
      {text && <p>{text}</p>}
    </div>
  )
}

