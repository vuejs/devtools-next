import type { ModuleInfo } from '@vue-devtools-next/core'
import { DataSet } from 'vis-network/standalone'
import type { Edge, Node, Options } from 'vis-network'

export const legends = {
  vue: {
    color: '#42b883',
  },
  ts: {
    color: '#3B86CB',
  },
  js: {
    color: '#d6cb2d',
  },
  json: {
    color: '#cf8f30',
  },
  css: {
    color: '#e6659a',
  },
  html: {
    color: '#e34c26',
  },
  jsx: {
    color: '#54B9D1',
  },
  tsx: {
    color: '#4FC7FF',
  },
  other: {
    color: '#B86542',
  },
} satisfies Record<string, { color: string }>

const capitalizeKeys = ['vue', 'other']

const isDark = useDark()
export const graphOptions = computed<Options>(() => ({
  autoResize: true,
  nodes: {
    shape: 'dot',
    size: 16,
    font: {
      color: isDark.value ? '#fff' : '#000',
      multi: 'html',
    },
  },
  interaction: {
    hover: true,
  },
  physics: {
    maxVelocity: 146,
    solver: 'forceAtlas2Based',
    timestep: 0.35,
    stabilization: {
      enabled: true,
      iterations: 200,
    },
  },
  groups: legends,
}))

export function useLegends() {
  const [legendShow, toggleLegend] = useToggle(true)

  return {
    legendsData: Object.entries(legends).map(([key, value]) => ({
      key,
      color: value.color,
      capitalize: capitalizeKeys.includes(key),
    })),
    legendShow,
    toggleLegend,
  }
}

export const matchedKeys = ref<string[]>([])

export interface GraphSettings {
  node_modules: false
}

export const graphSettings = useLocalStorage<GraphSettings>('devtools-next-graph-settings', {
  node_modules: false,
})

// ------------------ parse graph data ------------------
export function checkIsValidModule(module: ModuleInfo) {
  console.log('111')
  if (!graphSettings.value.node_modules && module.id.includes('node_modules'))
    return false
  return true
}

const isMatched = (id: string) => matchedKeys.value.includes(id)

function getFontStyle(id: string) {
  return {
    color: isMatched(id)
      ? '#F19B4A'
      : undefined,
  }
}

// NOTE: we can operate DataSet directly to change the graph,
// for performance reasons, just don't parse the whole raw data, instead, we update dataset
interface GraphNodesTotalData {
  mod: ModuleInfo
  node: Node
  edges: Edge[]
}
const graphNodesTotal = shallowRef<GraphNodesTotalData[]>([])
export const graphNodes = new DataSet<Node>([])
export const graphEdges = new DataSet<Edge>([])

export const modulesMap = shallowRef<Map<string, { filePath: string }>>(new Map())

export function parseGraphRawData(modules: ModuleInfo[]) {
  if (!modules)
    return
  graphNodes.clear()
  graphEdges.clear()

  const totalEdges: Edge[] = []
  const totalNode: Node[] = []

  modules.forEach((mod) => {
    const path = mod.id.replace(/\?.*$/, '').replace(/\#.*$/, '')
    const pathSegments = path.split('/')
    const id = mod.id
    if (!modulesMap.value.has(id))
      modulesMap.value.set(id, { filePath: path })
    else
      modulesMap.value.get(id)!.filePath = path
    const node: GraphNodesTotalData = {
      mod,
      node: {
        id,
        label: isMatched(id) ? `<b>${pathSegments.at(-1)}</b>` : pathSegments.at(-1),
        group: path.match(/\.(\w+)$/)?.[1] || 'unknown',
        size: 15 + Math.min(mod.deps.length / 2, 8),
        title: path,
        font: getFontStyle(id),
        shape: mod.id.includes('/node_modules/')
          ? 'hexagon'
          : mod.virtual
            ? 'diamond'
            : 'dot',
      },
      edges: [],
    }
    mod.deps.forEach((dep) => {
      node.edges.push({
        from: mod.id,
        to: dep,
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 0.8,
          },
        },
      })
    })
    graphNodesTotal.value.push(node)
    totalNode.push(node.node)
    totalEdges.push(...node.edges)
  })
  // set initial data
  graphNodes.add(totalNode.slice())
  graphEdges.add(totalEdges.slice())
}

watch(graphSettings, () => {
  graphNodes.clear()
  graphEdges.clear()
  // reuse cache instead of parse every time
  const nodeData = graphNodesTotal.value.slice()
  nodeData.forEach(({ node, edges, mod }) => {
    if (checkIsValidModule(mod)) {
      graphNodes.add(node)
      graphEdges.add(edges.slice())
    }
  })
}, { deep: true })
