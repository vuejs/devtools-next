import type { ComponentFilter } from './filter'
import { createComponentFilter } from './filter'

interface ComponentWalkerOptions {
  filterText?: string
}

export class ComponentWalker {
  componentFilter: InstanceType<typeof ComponentFilter>
  constructor(options: ComponentWalkerOptions) {
    const { filterText = '' } = options
    this.componentFilter = createComponentFilter(filterText)
  }
}
