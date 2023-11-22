import type { Options } from 'vis-network'

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
  svelte: {
    color: '#ff3e00',
  },
  jsx: {
    color: '#54B9D1',
  },
  tsx: {
    color: '#4FC7FF',
  },
} satisfies Record<string, { color: string }>

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
    legendsData: Object.entries(legends),
    legendShow,
    toggleLegend,
  }
}

export const matchedKeys = ref<string[]>([])
