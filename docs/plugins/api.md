# Plugins API

Plugins API for easier DevTools integrations.

## Installation

::: code-group

```sh [npm]
$ npm add -D @vue/devtools-next-api
```

```sh [pnpm]
$ pnpm add -D @vue/devtools-next-api
```

```sh [yarn]
$ yarn add -D @vue/devtools-next-api
```

```sh [bun]
$ bun add -D @vue/devtools-next-api
```

:::

## `addCustomTab`

```ts
import { devtools } from '@vue/devtools-next-api'

addCustomTab({
  // unique identifier
  name: 'vue-use',
  // title to display in the tab
  title: 'VueUse',
  // any icon from Iconify, or a URL to an image
  icon: 'i-logos-vueuse',
  // iframe view
  view: {
    type: 'iframe',
    src: 'https://vueuse.org/',
  },
  category: 'advanced',
})
```

## `addCustomCommand`

```ts
import { addCustomCommand } from '@vue/devtools-next-api'

// Add a custom command with auxiliary menus
addCustomCommand({
  // unique identifier
  id: 'vueuse',
  // title to display in the command
  title: 'VueUse',
  // any icon from Iconify, or a URL to an image
  icon: 'i-logos-vueuse',
  // command children, will show if the command is executed
  children: [
    {
      id: 'vueuse:github',
      title: 'Github',
      icon: 'i-logos-github',
      action: {
        type: 'url',
        src: 'https://github.com/vueuse/vueuse'
      }
    },
    {
      id: 'vueuse:website',
      title: 'Website',
      icon: 'i-logos-vueuse',
      action: {
        type: 'url',
        src: 'https://vueuse.org/'
      }
    },
  ],
})

// Add a custom command with url
addCustomCommand({
  // unique identifier
  id: 'vueuse',
  // title to display in the command
  title: 'VueUse',
  // any icon from Iconify, or a URL to an image
  icon: 'i-logos-vueuse',
  action: {
    // action type, only support `url` for now
    type: 'url',
    // url to open when the command is executed
    src: 'https://vueuse.org/'
  }
})
```

## `removeCustomCommand`

```ts
import { removeCustomCommand } from '@vue/devtools-next-api'

// Remove a custom command by id
removeCustomCommand('vueuse')
```
