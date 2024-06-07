import type { RouteRecordNormalized } from 'vue-router'
import { mount } from '@vue/test-utils'
import RoutePathItem from '../RoutePathItem.vue'

describe('component: RoutePathItem', () => {
  it('parseExpressRoute can correctly split the route string', () => {
    const component = mount(RoutePathItem, {
      props: {
        route: {
          path: '/hey/',
          name: 'heya',
        } as RouteRecordNormalized,
      },
    })
    const parseExpressRoute = (component.vm as any).parseExpressRoute
    expect(parseExpressRoute('/foo/:id(\\d+)/bar')).toEqual(['/foo/', ':id(\\d+)', '/bar'])
    expect(parseExpressRoute('/foo/:id*')).toEqual(['/foo/', ':id*'])
    expect(parseExpressRoute('/foo/:id+')).toEqual(['/foo/', ':id+'])
    expect(parseExpressRoute('/foo/:id/bar')).toEqual(['/foo/', ':id', '/bar'])
    expect(parseExpressRoute('/foo/:id')).toEqual(['/foo/', ':id'])
    // Example from Vue Router documentation
    // https://router.vuejs.org/guide/essentials/dynamic-matching.html#Catch-all-404-Not-found-Route
    expect(parseExpressRoute('/foo-:bar(.*)')).toEqual(['/foo-', ':bar(.*)'])
  })
})
