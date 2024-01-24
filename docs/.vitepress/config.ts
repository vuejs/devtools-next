import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { version } from '../../package.json'
import vite from './vite.config'

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Getting Started', link: '/guide/getting-started' },
  { text: 'Features', link: '/guide/features' },
  { text: 'Contributing', link: '/guide/contributing' },
  { text: 'FAQ', link: '/guide/faq' },
  { text: 'Vite Plugin', link: '/guide/vite-plugin' },
  { text: 'Browser Extension', link: '/guide/browser-extension' },
  { text: 'Standalone App', link: '/guide/standalone' },
]

const PLUGINS: DefaultTheme.NavItemWithLink[] = [
  { text: 'API', link: '/plugins/api' },
]

const VERSIONS: DefaultTheme.NavItemWithLink[] = [
  { text: `v${version} (current)`, link: '/' },
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vue DevTools',
  description: 'Unleash Vue Developer Experience',
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },

  cleanUrls: true,
  vite,
  themeConfig: {
    siteTitle: false,
    logo: { src: '/logo-mini.svg', width: 60, height: 60 },
    nav: [
      {
        text: 'Guide',
        items: [
          {
            items: GUIDES,
          },
        ],
      },
      { text: 'Features', link: '/guide/features' },
      {
        text: 'Plugins',
        items: [
          {
            items: PLUGINS,
          },
        ],
      },
      {
        text: `v${version}`,
        items: VERSIONS,
      },
    ],

    sidebar: Object.assign(
      {},
      {
        '/': [
          {
            text: 'Guide',
            items: GUIDES,
          },
          {
            text: 'Plugins',
            items: [
              {
                items: PLUGINS,
              },
            ],
          },
        ],
        // '/plugins/': [
        //   {
        //     text: 'Guide',
        //     items: GUIDES,
        //   },
        //   {
        //     text: 'Plugins',
        //     items: [
        //       {
        //         items: PLUGINS,
        //       },
        //     ],
        //   },
        // ],
      },

    ),

    editLink: {
      pattern: 'https://github.com/vuejs/devtools-next/edit/main/docs/:path',
      text: 'Suggest changes to this page',
    },
    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/devtools-next' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-PRESENT Arlo(webfansplz).',
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo-mini.svg' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Arlo(webfansplz)' }],
    ['meta', { name: 'og:site_name', content: 'Vue DevTools' }],
    ['meta', { property: 'og:title', content: 'Vue DevTools' }],
    ['meta', { property: 'og:image', content: '' }],
    ['meta', { property: 'og:description', content: 'Unleash Vue Developer Experience' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
  ],
})
