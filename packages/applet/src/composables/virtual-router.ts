import type { Component, InjectionKey, Ref } from 'vue'
import { computed, defineComponent, h, inject, provide, ref } from 'vue'

const VirtualRouteKey: InjectionKey<Ref<{ path: string }>> = Symbol('VirtualRouteKey')

export function registerVirtualRouter(routes: { path: string, component: Component }[]) {
  const route = ref<{ path: string }>({
    path: '/',
  })
  const routePath = computed(() => route.value.path)

  const VirtualRouterView = defineComponent({
    setup() {
      return () => {
        const route = routes.find(route => route.path === routePath.value)
        if (route)
          return h(route.component)

        return null
      }
    },
  })

  provide(VirtualRouteKey, route)
  return { VirtualRouterView }
}

export function useVirtualRouter() {
  const route = inject(VirtualRouteKey)!

  return {
    push(path: string) {
      route.value.path = path
    },
  }
}
