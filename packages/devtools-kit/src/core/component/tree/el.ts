import type { VNode } from 'vue'
import { isFragment } from '../utils'
import type { VueAppInstance } from '../../../types'

export function getRootElementsFromComponentInstance(instance: VueAppInstance): VNode[] {
  if (isFragment(instance))
    return getFragmentRootElements(instance.subTree)

  if (!instance.subTree)
    return []
  return [instance.subTree.el] as VNode[]
}

function getFragmentRootElements(vnode: VNode): VNode[] {
  if (!vnode.children)
    return []

  const list: VNode[] = []

  ;(vnode.children as VNode[]).forEach((childVnode) => {
    if (childVnode.component)
      list.push(...getRootElementsFromComponentInstance(childVnode.component as VueAppInstance))

    else if (childVnode?.el)
      list.push(childVnode.el as VNode)
  })

  return list
}
