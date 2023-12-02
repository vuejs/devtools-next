type TabCategory =
  | 'pinned'
  | 'app'
  | 'modules'
  | 'advanced'

export type ModuleView = ModuleIframeView

export interface ModuleIframeView {
  /**
   * Iframe view
   */
  type: 'iframe'
  /**
   * Url of the iframe
   */
  src: string
  /**
   * Persist the iframe instance even if the tab is not active
   *
   * @default true
   */
  persistent?: boolean
}

export interface CustomTab {
  /**
   * The name of the tab, must be unique
   */
  name: string
  /**
   * Icon of the tab, support any Iconify icons, or a url to an image
   */
  icon?: string
  /**
   * Title of the tab
   */
  title: string
  /**
   * Main view of the tab
   */
  view: ModuleView
  /**
   * Category of the tab
   * @default 'app'
   */
  category?: TabCategory
}
