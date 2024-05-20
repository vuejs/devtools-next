import { getMessagingContext, updateMessagingContext } from '../context'
import type { MessagingContext } from '../context'

export function setCurrentMessagingEnv(env: MessagingContext['env']) {
  updateMessagingContext({ env })
}

export function getCurrentMessagingEnv() {
  return getMessagingContext().env
}
