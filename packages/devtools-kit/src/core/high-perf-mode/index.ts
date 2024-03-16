import { devtoolsState } from '../../state'

export function toggleHighPerfMode(state?: boolean) {
  devtoolsState.highPerfModeEnabled = state ?? !devtoolsState.highPerfModeEnabled
}
