export async function getQrcode() {
  const res = await fetch('https://lblblong-mossgpt-api.deno.dev/qrcode')
  const { code, data, message } = await res.json()
  if (code !== 0) throw Error(message)
  return data
}

export async function getQrcodePay() {
  const res = await fetch('https://lblblong-mossgpt-api.deno.dev/qrcodePay')
  const { code, data, message } = await res.json()
  if (code !== 0) throw Error(message)
  return data
}

export async function getNotice() {
  const res = await fetch('https://lblblong-mossgpt-api.deno.dev/notice')
  const { code, data, message } = await res.json()
  if (code !== 0) throw Error(message)
  if (data === null) throw Error('没有通知')
  return data
}

