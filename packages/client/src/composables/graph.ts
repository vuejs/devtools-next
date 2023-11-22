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

export function useLegends() {
  const [legendShow, toggleLegend] = useToggle(true)

  return {
    legendsData: Object.entries(legends),
    legendShow,
    toggleLegend,
  }
}
