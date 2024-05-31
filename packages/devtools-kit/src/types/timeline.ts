export interface TimelineEvent<TData = any, TMeta = any> {
  time: number
  data: TData
  logType?: 'default' | 'warning' | 'error'
  meta?: TMeta
  groupId?: number | string
  title?: string
  subtitle?: string
}

export interface ScreenshotOverlayEvent {
  layerId: string
  renderMeta: any
}

export interface ScreenshotOverlayRenderContext<TData = any, TMeta = any> {
  screenshot: ScreenshotData
  events: (TimelineEvent<TData, TMeta> & ScreenshotOverlayEvent)[]
  index: number
}

export type ScreenshotOverlayRenderResult = HTMLElement | string | false

export interface ScreenshotData {
  time: number
}

export interface TimelineLayerOptions<TData = any, TMeta = any> {
  id: string
  label: string
  color: number
  skipScreenshots?: boolean
  groupsOnly?: boolean
  ignoreNoDurationGroups?: boolean
  screenshotOverlayRender?: (event: TimelineEvent<TData, TMeta> & ScreenshotOverlayEvent, ctx: ScreenshotOverlayRenderContext) => ScreenshotOverlayRenderResult | Promise<ScreenshotOverlayRenderResult>
}
export interface TimelineEventOptions {
  layerId: string
  event: TimelineEvent
  all?: boolean
}
