import type { ModuleInfo } from '@vue-devtools-next/core'
import { DataSet } from 'vis-network/standalone'
import type { Edge, Node, Options } from 'vis-network'

// #region legends
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
// #endregion

// #region graph options
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
// #endregion

// #region graph settings
export interface GraphSettings {
  node_modules: boolean
  virtual: boolean
  lib: boolean
}

export const graphSettings = useLocalStorage<GraphSettings>('vue-devtools-next-graph-settings', {
  node_modules: false,
  virtual: false,
  lib: false,
})

watch(graphSettings, () => {
  updateGraph()
}, { deep: true })
// #endregion

// #region graph search
interface SearcherNode {
  id: string
  fullId: string
  node: Node
  edges: Edge[]
  deps: string[]
}

export const graphSearchText = ref('')

watchDebounced(graphSearchText, () => {
  updateGraph()
}, {
  debounce: 350,
})

// #region graph data
// NOTE: we can operate DataSet directly to change the graph,
// for performance reasons, just don't parse the whole raw data, instead, we update dataset

interface GraphNodesTotalData {
  mod: ModuleInfo
  node: Node
  edges: Edge[]
}

export const projectRoot = ref('')
const graphNodesTotal = shallowRef<GraphNodesTotalData[]>([])
export const graphNodes = new DataSet<Node>([])
export const graphEdges = new DataSet<Edge>([])
export const modulesMap = new Map<string, GraphNodesTotalData>()

export function checkIsValidModule(module: ModuleInfo) {
  if (!graphSettings.value.node_modules && module.id.includes('node_modules'))
    return false
  if (!graphSettings.value.virtual && module.virtual)
    return false
  if (!graphSettings.value.lib && !module.id.includes(projectRoot!.value) && !module.virtual)
    return false
  return true
}

const EXTRACT_LAST_THREE_MOD_ID_RE = /(?:.*\/){3}([^\/]+$)/

function updateGraph() {
  graphNodes.clear()
  graphEdges.clear()

  const matchedNodes: Node[] = []
  const matchedSearchNodes: SearcherNode[] = []
  const matchedEdges: Edge[] = []

  // reuse cache instead of parse every time
  const nodeData = graphNodesTotal.value.slice()
  nodeData.forEach(({ node, edges, mod }) => {
    if (checkIsValidModule(mod)) {
      matchedNodes.push(node)
      matchedSearchNodes.push({
        // only search the exactly name(last 3 segments), instead of full path
        id: mod.id.match(EXTRACT_LAST_THREE_MOD_ID_RE)?.[0] ?? mod.id,
        fullId: mod.id,
        node,
        edges,
        deps: mod.deps,
      })
      matchedEdges.push(...edges)
    }
  })

  // use include, instead of fuse.js, for performance reasons
  // if someone need it, we can add it back
  const searchText = graphSearchText.value
  if (searchText.trim().length) {
    const result = matchedSearchNodes.filter(({ id }) => id.includes(searchText))
    matchedEdges.length = 0
    matchedNodes.length = 0
    if (result.length) {
      const { node, edges } = recursivelyGetNodeByDep(result)
      // need recursively get all nodes and it's dependencies
      matchedNodes.push(...node)
      matchedEdges.push(...edges)
    }
  }

  graphNodes.add(matchedNodes)
  graphEdges.add(matchedEdges)
}

function recursivelyGetNodeByDep(node: SearcherNode[]) {
  const allNodes = new Map</* fullId */string, Node>()
  const allEdges = new Map</* from-to */string, Edge>()
  node.forEach((n) => {
    n = deepClone(n)
    // to highlight current searched node
    if (!n.node.font)
      n.node.font = { color: '#F19B4A' }
    n.node.label = `<b>${n.node.label}</b>`
    allNodes.set(n.fullId, n.node)
    n.deps.forEach((dep) => {
      const node = modulesMap.get(dep)
      // also check deps is valid
      if (node && checkIsValidModule(node.mod)) {
        allNodes.set(node.mod.id, node.node)
        allEdges.set(`${n.fullId}-${node.mod.id}`, getEdge(node.mod.id, n.fullId))
        node.edges.forEach(edge => allEdges.set(`${edge.from}-${edge.to}`, edge))
      }
    })
  })
  return {
    node: Array.from(allNodes.values()),
    edges: Array.from(allEdges.values()),
  }
}

// #endregion

// #region parse graph raw data
function getEdge(modId: string, dep: string) {
  return {
    from: modId,
    to: dep,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.8,
      },
    },
  }
}

export function parseGraphRawData(modules: ModuleInfo[], root: string) {
  if (!modules)
    return
  projectRoot.value = root
  graphNodes.clear()
  graphEdges.clear()

  const totalEdges: Edge[] = []
  const totalNode: Node[] = []

  modules.forEach((mod) => {
    const path = mod.id.replace(/\?.*$/, '').replace(/\#.*$/, '').replace(root, '')
    const pathSegments = path.split('/')
    const id = mod.id
    const node: GraphNodesTotalData = {
      mod,
      node: {
        id,
        label: pathSegments.at(-1),
        group: path.match(/\.(\w+)$/)?.[1] || 'unknown',
        size: 15 + Math.min(mod.deps.length / 2, 8),
        title: path,
        shape: mod.id.includes('/node_modules/')
          ? 'hexagon'
          : mod.virtual
            ? 'diamond'
            : 'dot',
      },
      edges: [],
    }
    mod.deps.forEach((dep) => {
      node.edges.push(getEdge(mod.id, dep))
    })
    graphNodesTotal.value.push(node)

    // save cache, to speed up search
    modulesMap.set(id, node)

    // first time, we also need check
    if (checkIsValidModule(mod)) {
      totalNode.push(node.node)
      totalEdges.push(...node.edges)
    }
  })
  // set initial data
  graphNodes.add(totalNode.slice())
  graphEdges.add(totalEdges.slice())
}
// #endregion
