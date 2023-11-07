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

// graph
export interface ModuleInfo {
  id: string
  plugins: { name: string; transform?: number; resolveId?: number }[]
  deps: string[]
  virtual: boolean
}

export interface ViteRPCFunctions {
  root(): string
  getGraph(): Promise<ModuleInfo[]>
  getStaticAssets(): Promise<AssetInfo[]>
  getImageMeta(filepath: string): Promise<ImageMeta | undefined>
  getTextAssetContent(filepath: string, limit?: number): Promise<string | undefined>
}
