import { colord } from 'colord'

// copied from @vue/ui
export const themeDef = {
  colors: {
    'white': '#ffffff',
    'black': '#0b1015',

    // gray
    'gray-900': '#1d2935',
    'gray-800': '#2c3e50',
    'gray-700': '#3e5770',
    'gray-600': '#4f6f7f',
    'gray-500': '#809fae',
    'gray-400': '#93b0be',
    'gray-300': '#b6c6ce',
    'gray-200': '#c8d3d9',
    'gray-100': '#e0e5e7',

    // primary
    'primary-900': '#034124',
    'primary-800': '#085e37',
    'primary-700': '#13794a',
    'primary-600': '#299f69',
    'primary-500': '#42b983',
    'primary-400': '#56cd96',
    'primary-300': '#89deb7',
    'primary-200': '#abeacd',
    'primary-100': '#e0f8ed',

    // accent
    'accent-900': '#350066',
    'accent-800': '#4f0098',
    'accent-700': '#6806c1',
    'accent-600': '#8929e3',
    'accent-500': '#a44cf6',
    'accent-400': '#b96dff',
    'accent-300': '#c88eff',
    'accent-200': '#d7adff',
    'accent-100': '#e6ccff',

    // danger

    'danger-900': '#500000',
    'danger-800': '#850505',
    'danger-700': '#ac0d0d',
    'danger-600': '#cd1b1b',
    'danger-500': '#e83030',
    'danger-400': '#f44747',
    'danger-300': '#ff6565',
    'danger-200': '#ff9494',
    'danger-100': '#ffcaca',

    // warning
    'warning-900': '#702200',
    'warning-800': '#943800',
    'warning-700': '#b54d01',
    'warning-600': '#c85900',
    'warning-500': '#ea6e00',
    'warning-400': '#ff8915',
    'warning-300': '#ffa733',
    'warning-200': '#ffc45e',
    'warning-100': '#ffe6b0',

    // info
    'info-900': '#004576',
    'info-800': '#006294',
    'info-700': '#007db1',
    'info-600': '#0098c4',
    'info-500': '#03c2e6',
    'info-400': '#74e0ed',
    'info-300': '#9ae6ef',
    'info-200': '#bceef1',
    'info-100': '#e3f5f6',
  },
}

export const theme = {
  colors: Object.entries(themeDef.colors).reduce((acc, [key, value]) => {
    acc[key] = value
    acc[`${key}-lighter`] = colord(value).lighten(0.025).toHex()
    acc[`${key}-darker`] = colord(value).darken(0.08).toHex()
    return acc
  }, {} as Record<string, any>),
  fontFamily: {
    sans: 'Avenir, Helvetica, Arial, sans-serif',
  },
}
