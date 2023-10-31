// assets
export type AssetType = 'image' | 'font' | 'video' | 'audio' | 'text' | 'json' | 'other'
export interface AssetInfo {
  path: string
  type: AssetType
  publicPath: string
  filePath: string
  size: number
  mtime: number
}
export interface ImageMeta {
  width: number
  height: number
  orientation?: number
  type?: string
  mimeType?: string
}

export interface AssetEntry {
  path: string
  content: string
  encoding?: BufferEncoding
  override?: boolean
}

export interface CodeSnippet {
  code: string
  lang: string
  name: string
  docs?: string
}

export interface ViteRPCFunctions {
  root(): string
  getStaticAssets(): Promise<AssetInfo[]>
}
