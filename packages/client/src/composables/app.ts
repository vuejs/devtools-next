import type { DevtoolsBridgeAppRecord } from '@vue-devtools-next/core'

export const activeAppRecords = shallowRef<DevtoolsBridgeAppRecord[]>([])
export const activeAppRecordId = ref<string | null>(null)
export const activeAppRecord = computed(() => activeAppRecords.value.find(r => r.id === activeAppRecordId.value))
