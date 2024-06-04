import { useCustomInspector } from '@vue/devtools-applet'
import { useDevToolsState } from '@vue/devtools-core'
import type { ModuleBuiltinTab } from '~/types/tab'

export function useCustomInspectorTabs() {
  const state = useDevToolsState()
  const { registeredInspector } = useCustomInspector()

  const customInspectorTabs = computed<ModuleBuiltinTab[]>(() => {
    return registeredInspector.value.map((inspector, index) => {
      return {
        order: index,
        // @ts-expect-error skip type check
        name: inspector.id,
        // @ts-expect-error skip type check
        icon: inspector.logo,
        // @ts-expect-error skip type check
        title: inspector.label,
        // @ts-expect-error skip type check
        path: `${CUSTOM_INSPECTOR_TAB_VIEW}/${inspector.id}`,
        category: 'modules',
      }
    })
  })

  return customInspectorTabs
}
