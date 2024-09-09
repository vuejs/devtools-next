import { isFragment } from '../utils'
import type { VueAppInstance } from '../../../types'
import type { ComponentBoundingRect } from '../types'

// #region rect util
function createRect() {
  const rect = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    get width() { return rect.right - rect.left },
    get height() { return rect.bottom - rect.top },
  }
  return rect
}

let range: any
function getTextRect(node: any) {
  if (!range)
    range = document.createRange()

  range.selectNode(node)

  return range.getBoundingClientRect()
}

function getFragmentRect(vnode: any) {
  const rect = createRect()
  if (!vnode.children)
    return rect

  for (let i = 0, l = vnode.children.length; i < l; i++) {
    const childVnode = vnode.children[i]
    let childRect
    if (childVnode.component) {
      childRect = getComponentBoundingRect(childVnode.component)
    }
    else if (childVnode.el) {
      const el = childVnode.el
      if (el.nodeType === 1 || el.getBoundingClientRect)
        childRect = el.getBoundingClientRect()

      else if (el.nodeType === 3 && el.data.trim())
        childRect = getTextRect(el)
    }
    if (childRect)
      mergeRects(rect, childRect)
  }

  return rect
}

function mergeRects(a: any, b: any) {
  if (!a.top || b.top < a.top)
    a.top = b.top

  if (!a.bottom || b.bottom > a.bottom)
    a.bottom = b.bottom

  if (!a.left || b.left < a.left)
    a.left = b.left

  if (!a.right || b.right > a.right)
    a.right = b.right

  return a
}

// #endregion

const DEFAULT_RECT = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0,
}

export function getComponentBoundingRect(instance: VueAppInstance): ComponentBoundingRect {
  const el = instance.subTree.el

  if (typeof window === 'undefined') {
    // @TODO: Find position from instance or a vnode (for functional components).
    return DEFAULT_RECT
  }

  if (isFragment(instance))
    return getFragmentRect(instance.subTree)

  else if (el?.nodeType === 1)
    return el?.getBoundingClientRect()

  else if (instance.subTree.component)
    return getComponentBoundingRect(instance.subTree.component as VueAppInstance)
  else
    return DEFAULT_RECT
}
