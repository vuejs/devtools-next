import type { ChannelOptions } from 'birpc'

export type MergeableChannelOptions = Omit<ChannelOptions, 'serialize' | 'deserialize'>

export type Channel = MergeableChannelOptions | {
  channels: MergeableChannelOptions[]
}
