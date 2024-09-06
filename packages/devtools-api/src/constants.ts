/**
 * - https://vitejs.dev/guide/env-and-mode.html#node-env-and-modes
 * - https://webpack.js.org/guides/production/#specify-the-mode
 * - https://www.rspack.dev/config/mode
 *
 * Modern bundlers are support NODE_ENV environment variable out-of the box, so we can use it to determine the environment.
 */
export const __DEV__ = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'
