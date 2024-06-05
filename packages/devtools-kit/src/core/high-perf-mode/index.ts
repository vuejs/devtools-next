import { devtoolsState } from '../../ctx/state'

export function toggleHighPerfMode(state?: boolean) {
  devtoolsState.highPerfModeEnabled = state ?? !devtoolsState.highPerfModeEnabled
}
