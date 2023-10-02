import type { ComponentFilter } from './filter'
import { componentFilter } from './filter'

interface ComponentWalkerOptions {
  filterText?: string
}

export class ComponentWalker {
  componentFilter: InstanceType<typeof ComponentFilter>
  constructor(options: ComponentWalkerOptions) {
    const { filterText = '' } = options
    this.componentFilter = componentFilter(filterText)
  }
}
