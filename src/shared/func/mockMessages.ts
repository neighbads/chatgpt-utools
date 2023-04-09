import { Message } from '../../models/message'

export function mockMessages(opts: {
  messages: Pick<Message, 'text' | 'role' | 'state' | 'failedReason'>[]
  conversationId: string
}) {
  const { messages, conversationId } = opts
  const now = Date.now()
  const result: Message[] = []
  for (let i = 0; i < messages.length; i++) {
    const lastMessage = result[result.length - 1]
    const message = messages[i]
    result.push(
      new Message({
        ...message,
        createdAt: now + i,
        parentMessageId: lastMessage?.id,
        conversationId,
      })
    )
  }
  return result
}

