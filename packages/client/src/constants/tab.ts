import type { DevtoolsBridgeAppRecord } from '@vue/devtools-core'
import { deepClone, isInElectron } from '@vue/devtools-shared'
import type { ModuleBuiltinTab } from '~/types'

// @unocss-include
export const builtinTab: [string, ModuleBuiltinTab[]][] = [
  ['app', [
    {
      icon: 'i-carbon-information',
      name: 'overview',
      order: -100,
      path: 'overview',
      title: 'Overview',
    },
    {
      icon: 'i-carbon-assembly-cluster',
      name: 'components',
      order: -100,
      path: 'components',
      title: 'Components',
    },
    {
      icon: 'i-carbon-tree-view-alt',
      name: 'pages',
      order: -100,
      path: 'pages',
      title: 'Pages',
    },
    {
      icon: 'i-carbon-image-copy',
      name: 'assets',
      order: -100,
      path: 'assets',
      title: 'Assets',
    },
    {
      icon: 'i-icon-park-outline:vertical-timeline',
      name: 'timeline',
      order: -100,
      path: 'timeline',
      title: 'Timeline',
    },
  ]],
  ['modules', [
    {
      icon: 'i-ri-route-line',
      name: 'router',
      order: -100,
      path: 'router',
      title: 'Router',
    },
    {
      icon: 'i-logos-pinia',
      name: 'pinia',
      order: -100,
      path: 'pinia',
      title: 'Pinia',
    },
    {
      icon: 'i-carbon-language',
      name: 'i18n',
      order: -100,
      path: 'i18n',
      title: 'I18n Resources',
    },
  ]],
  ['advanced', [
    {
      icon: 'i-carbon-network-4',
      name: 'graph',
      order: -100,
      path: 'graph',
      title: 'Graph',
    },
  ]],
]

export const viteOnlyTabs = [
  'assets',
  'graph',
  'vite-inspect',
]

type Detective = NonNullable<DevtoolsBridgeAppRecord['moduleDetectives']>

const moduleDetectivesMapping = {
  pinia: 'pinia',
  router: 'vueRouter',
  i18n: 'vueI18n',
} satisfies Record<string, keyof Detective>

export function isDetected(moduleDetectives: Detective, tab: ModuleBuiltinTab) {
  const key = tab.name
  return key in moduleDetectivesMapping && moduleDetectives[moduleDetectivesMapping[key]]
}

export function getBuiltinTab(viteDetected: boolean, moduleDetectives?: DevtoolsBridgeAppRecord['moduleDetectives']): [string, ModuleBuiltinTab[]][] {
  const tab = deepClone(builtinTab)
  // filter out modules that are not detected
  tab.forEach((item) => {
    if (item[0] === 'modules')
      item[1] = item[1].filter(t => moduleDetectives ? isDetected(moduleDetectives, t) : true)
  })

  // @TODO: electron app support vite only tabs
  return (viteDetected && !isInElectron)
    ? tab
    : tab.map(([_, tabs]) => [_, tabs.filter(t => !viteOnlyTabs.includes(t.name))])
}
