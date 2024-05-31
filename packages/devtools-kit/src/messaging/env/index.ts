import { getMessagingContext, updateMessagingContext } from '../context'
import type { MessagingContext } from '../context'

export function setCurrentMessagingEnv(env: MessagingContext['env'], id?: string) {
  updateMessagingContext({ env }, id)
}

export function getCurrentMessagingEnv(id?: string) {
  return getMessagingContext(id)?.env
}
