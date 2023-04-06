interface IDoc {
  id: string
  text: string
}

interface MessageDoc extends IDoc {
  type: 'message'
  conversationId: string
}

interface ConversationDoc extends IDoc {
  type: 'conversation'
}

export type FuseDoc = MessageDoc | ConversationDoc

interface IItem {
  id: string
  type: string
  name: string
  text?: string
}

interface ConversationItem extends IItem {
  type: 'conversation'
  messageId?: string
}

export type FuseItem = ConversationItem
