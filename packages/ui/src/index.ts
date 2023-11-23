// No need to import "uno.css" to generate a css bundle file
// cause users will use UnoCSS to handle css fragment classes.
// Still provide a css bundle file for users who don't want to use UnoCSS.
import '@unocss/reset/tailwind.css'
import 'uno.css'

import { VTooltip } from 'floating-vue'

export * from './components'
export * from './composables'

export {
  VTooltip,
}
