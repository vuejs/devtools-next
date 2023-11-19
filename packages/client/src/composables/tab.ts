import type { ModuleBuiltinTab } from '~/types'

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
      icon: 'i-carbon-tree-view-alt',
      name: 'pages',
      order: -100,
      path: 'pages',
      title: 'Pages',
    },
    {
      icon: 'i-carbon-assembly-cluster',
      name: 'components',
      order: -100,
      path: 'components',
      title: 'Components',
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
      icon: 'i-icon-park-outline:pineapple',
      name: 'pinia',
      order: -100,
      path: 'pinia',
      title: 'Pinia',
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
