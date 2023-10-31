<script setup lang="ts">
import type { AssetInfo } from '@vue-devtools-next/core'
import { onDevToolsClientConnected, useDevToolsBridgeRpc } from '@vue-devtools-next/core'
import Fuse from 'fuse.js'

const DETAILS_MAX_ITEMS = 50
const search = ref('')
const navbar = ref<HTMLElement>()
const dropzone = ref(false)
const view = ref('grid')
const assets = ref<AssetInfo[]>([])
const bridgeRpc = useDevToolsBridgeRpc()
const extensions = reactiveComputed(() => {
  const results: { name: string; value: boolean }[] = []
  for (const asset of assets.value || []) {
    const ext = asset.path.split('.').pop()
    if (ext && !results.find(e => e.name === ext))
      results.push({ name: ext, value: true })
  }
  return results
})
const selected = ref<AssetInfo>()
const fuse = computed(() => new Fuse(assets.value || [], {
  keys: [
    'path',
  ],
}))
const filtered = computed(() => {
  const result = search.value
    ? fuse.value.search(search.value).map(i => i.item)
    : (assets.value || [])
  return result.filter((asset) => {
    const ext = asset.path.split('.').pop()
    return !ext || extensions.some(e => e.name === ext && e.value)
  })
})

const byFolders = computed(() => {
  const result: Record<string, AssetInfo[]> = {}
  for (const asset of filtered.value) {
    const folder = `${asset.path.split('/').slice(0, -1).join('/')}/`
    if (!result[folder])
      result[folder] = []
    result[folder].push(asset)
  }
  return Object.entries(result).sort(([a], [b]) => a.localeCompare(b))
})

const byTree = computed(() => {
  const root = { path: 'public', children: [] }

  const addToTree = (node: any, pathParts: any, file: AssetInfo) => {
    const [currentPart, ...remainingParts] = pathParts

    let child = node.children.find((child: any) => child.path === currentPart)
    if (!child) {
      child = { ...file, path: currentPart, children: [] }
      node.children.push(child)
    }

    if (remainingParts.length > 1)
      addToTree(child, remainingParts, file)
    else if (remainingParts.length === 1)
      child.children.push({ ...file, path: remainingParts[0] })
  }

  filtered.value.forEach((file) => {
    const pathParts = file.path.split('/').filter(part => part !== '')
    addToTree(root, pathParts, file)
  })

  return root.children
})

onDevToolsClientConnected(() => {
  bridgeRpc.getStaticAssets().then((res) => {
    assets.value = res
  })
})
function toggleView() {}
</script>

<template>
  <div h-full of-auto>
    <Navbar ref="navbar" v-model:search="search" pb2 :no-padding="true">
      <template #actions>
        <div flex-none flex="~ gap2 items-center" text-lg>
          <IconTitle
            v-tooltip.bottom-end="'File Upload'"
            icon="i-carbon:cloud-upload"
            title="File Upload" :border="false" flex="~ gap-0!"
            @click="dropzone = !dropzone"
          />
          <VDropdown direction="end" n="sm primary">
            <IconTitle
              v-tooltip.bottom-end="'Filter'"
              icon="i-carbon-filter" :border="false"
              title="Filter" p2 text-lg relative
              @click="() => {}"
            >
              <span flex="~ items-center justify-center" absolute bottom-0 right-2px h-4 w-4 rounded-full bg-primary-800 text-8px>
                10
              </span>
            </IconTitle>
            <template #popper>
              <div flex="~ col" w-30 of-auto>
                hello world
              <!-- <NCheckbox
                v-for="item of extensions"
                :key="item.name"
                v-model="item.value"
                flex="~ gap-2"
                rounded
                px2 py2
              >
                <span text-xs op75>
                  {{ item.name }}
                </span>
              </NCheckbox> -->
              </div>
            </template>
          </VDropdown>
          <IconTitle
            v-tooltip.bottom-end="'Toggle View'"
            text-lg :border="false"
            :icon="view === 'grid' ? 'i-carbon-list' : 'i-carbon-grid'"
            title="Toggle view"
            @click="toggleView"
          />
        </div>
      </template>
      <div op50>
        <span v-if="search">3 matched · </span>
        <span>10 assets in total</span>
      </div>
    </Navbar>

    <template v-if="view === 'grid'">
      <template v-if="byFolders.length > 1">
        <SectionBlock
          v-for="[folder, items] of byFolders"
          :key="folder"
          :text="folder"
          :description="`${items.length} items`"
          :open="items.length <= DETAILS_MAX_ITEMS"
          :padding="false"
        >
          <div mt--4 px2 grid="~ cols-minmax-8rem">
            <AssetGridItem v-for="a of items" :key="a.path" :asset="a" :folder="folder" @click="selected = a" />
          </div>
        </SectionBlock>
      </template>
      <div v-else p2 grid="~ cols-minmax-8rem">
        <AssetGridItem v-for="a of filtered" :key="a.path" :asset="a" @click="selected = a" />
      </div>
    </template>
  </div>
</template>
