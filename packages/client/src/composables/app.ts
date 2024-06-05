import type { AppRecord } from '@vue/devtools-kit'

export const activeAppRecords = shallowRef<AppRecord[]>([])
export const activeAppRecordId = ref<string | null>(null)
export const activeAppRecord = computed(() => activeAppRecords.value.find(r => r.id === activeAppRecordId.value))
