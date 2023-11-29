import { getComponentInstance } from '../component/general'
import { devtoolsContext } from '../general/state'
import { getInstanceName } from '../component/general/util'
import type { ToggleComponentInspectorOptions } from './types'

const CONTAINER_ELEMENT_ID = '__vue-devtools-component-inspector__'
const CARD_ELEMENT_ID = '__vue-devtools-component-inspector__card__'
const COMPONENT_NAME_ELEMENT_ID = '__vue-devtools-component-inspector__name__'
const INDICATOR_ELEMENT_ID = '__vue-devtools-component-inspector__indicator__'

const containerStyles = {
  display: 'block',
  zIndex: 2147483640,
  position: 'fixed',
  backgroundColor: '#42b88325',
  border: '1px solid #42b88350',
  borderRadius: '5px',
  transition: 'all 0.1s ease-in',
  pointerEvents: 'none',
}

const cardStyles = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  padding: '5px 8px',
  borderRadius: '4px',
  textAlign: 'left',
  position: 'absolute',
  left: 0,
  color: '#e9e9e9',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: '24px',
  backgroundColor: '#42b883',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
}

const indicatorStyles = {
  display: 'inline-block',
  fontWeight: 400,
  fontStyle: 'normal',
  fontSize: '12px',
  opacity: 0.7,
}

function getCotainerElement() {
  return document.getElementById(CONTAINER_ELEMENT_ID)
}

function getCardElement() {
  return document.getElementById(CARD_ELEMENT_ID)
}

function getIndicatorElement() {
  return document.getElementById(INDICATOR_ELEMENT_ID)
}

function getNameElement() {
  return document.getElementById(COMPONENT_NAME_ELEMENT_ID)
}

function getStyles(bounds: ToggleComponentInspectorOptions['bounds']) {
  return {
    left: `${bounds.left}px`,
    top: `${bounds.top}px`,
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
  } satisfies Partial<CSSStyleDeclaration>
}

function create(options: ToggleComponentInspectorOptions) {
  // create container
  const containerEl = document.createElement('div')
  containerEl.id = CONTAINER_ELEMENT_ID
  Object.assign(containerEl.style, {
    ...containerStyles,
    ...getStyles(options.bounds),
  })

  // create card
  const cardEl = document.createElement('span')
  cardEl.id = CARD_ELEMENT_ID
  Object.assign(cardEl.style, {
    ...cardStyles,
    top: options.bounds.top < 35 ? 0 : '-35px',
  })

  // create name
  const nameEl = document.createElement('span')
  nameEl.id = COMPONENT_NAME_ELEMENT_ID
  nameEl.innerHTML = `&lt;${options.name}&gt;&nbsp;&nbsp;`

  // create indicator
  const indicatorEl = document.createElement('i')
  indicatorEl.id = INDICATOR_ELEMENT_ID
  indicatorEl.innerHTML = `${Math.round(options.bounds.width * 100) / 100} x ${Math.round(options.bounds.height * 100) / 100}`
  Object.assign(indicatorEl.style, indicatorStyles)

  // append
  cardEl.appendChild(nameEl)
  cardEl.appendChild(indicatorEl)
  containerEl.appendChild(cardEl)
  document.body.appendChild(containerEl)
}

function update(options: ToggleComponentInspectorOptions) {
  const containerEl = getCotainerElement()
  const cardEl = getCardElement()!
  const nameEl = getNameElement()!
  const indicatorEl = getIndicatorElement()!

  if (containerEl) {
    Object.assign(containerEl.style, {
      ...containerStyles,
      ...getStyles(options.bounds),
    })
    Object.assign(cardEl.style, {
      top: options.bounds.top < 35 ? 0 : '-35px',
    })
    nameEl.innerHTML = `&lt;${options.name}&gt;&nbsp;&nbsp;`
    indicatorEl.innerHTML = `${Math.round(options.bounds.width * 100) / 100} x ${Math.round(options.bounds.height * 100) / 100}`
  }
}

export function toggleComponentInspector(options: ToggleComponentInspectorOptions) {
  if (options.visible) {
    const instance = getComponentInstance(devtoolsContext.appRecord!, options.id)
    if (instance && (options.bounds.width || options.bounds.height)) {
      const name = getInstanceName(instance)
      const el = getCotainerElement()
      el ? update({ ...options, name }) : create({ ...options, name })
    }
  }
  else {
    const el = getCotainerElement()
    if (el)
      el.style.display = 'none'
  }
}
