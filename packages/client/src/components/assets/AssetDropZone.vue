<script lang="ts" setup>
import { VueButton, VueIcon, VueInput } from '@vue/devtools-ui'
import type { AssetEntry } from '@vue/devtools-core'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  folder: {
    type: String,
    required: true,
  },
})

const visible = useVModel(props, 'modelValue')
const lastTarget = ref()

const files = ref<File[]>([])

function onDragEnter(e: DragEvent) {
  lastTarget.value = e.target
  visible.value = true
}
function onDragLeave(e: DragEvent) {
  if (e.target === lastTarget.value)
    visible.value = false
}
function onDragOver(e: DragEvent) {
  e.preventDefault()
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  setFiles(e.dataTransfer!.files)
}

function setFiles(data: FileList | null) {
  const inputFiles = Array.from(data || [])
  if (inputFiles.length) {
    const newFiles: File[] = []
    const existingFileNames: string[] = files.value.map(file => file.name)
    for (const file of inputFiles) {
      if (existingFileNames.includes(file.name)) {
        let i = 1
        const [name, ext] = file.name.split('.')
        while (existingFileNames.includes(`${name} (${i}).${ext}`))
          i++
        const newFilename = `${name}-${i}.${ext}`
        const blob = new Blob([file], { type: file.type })
        const newFile = new File([blob], newFilename, { lastModified: Date.now() })
        newFiles.push(newFile)
        existingFileNames.push(newFilename)
      }
      else {
        if (file.type === '') {
          // devtoolsUiShowNotification({
          //   message: 'Folders are not supported yet',
          //   icon: 'carbon:face-dissatisfied',
          //   classes: 'text-orange',
          // })
        }
        newFiles.push(file)
      }
    }
    files.value = [...files.value, ...newFiles]
  }
}

async function uploadFiles() {
  const uploadFiles: AssetEntry[] = []
  for (const file of files.value) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    const result = await new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string)
    })
    // TODO: add validation
    const content = result.split(';base64,').pop()!
    uploadFiles.push({
      path: file.name,
      encoding: 'base64',
      content,
    })
  }

  visible.value = false
}

function removeFile(index: number) {
  files.value?.splice(index, 1)
}

function blobIt(file: File) {
  return URL.createObjectURL(file)
}

function changeName(file: File, newName: string) {
  const [name, ext] = file.name.split('.')
  const baseName = newName.replace(/\.\w+$/, '')
  const newFileName = `${baseName}.${ext}`
  if (baseName.length === 0) {
    // TODO: with proper dialog
    // eslint-disable-next-line no-alert
    alert('File name must be at least 1 characters long')
    return name
  }
  Object.defineProperty(file, 'name', { value: newFileName, writable: false })
  files.value.splice(files.value.indexOf(file), 1, file)
  return file
}

function clearFiles() {
  files.value = []
}

function close() {
  visible.value = false
  clearFiles()
}

useEventListener('dragenter', onDragEnter)
useEventListener('dragleave', onDragLeave)
useEventListener('dragover', onDragOver)
useEventListener('drop', onDrop)
</script>

<template>
  <div
    fixed bottom-0 left-13 right-0 top-0 z-10 backdrop-blur-20 transition-all
    :class="visible ? 'opacity-100 visible' : 'opacity-0 invisible'"
  >
    <VueIcon
      v-tooltip.bottom-end="'Close'"
      icon="i-carbon-close"
      title="Close"

      :border="false"
      action absolute right-5 top-5 z-20 text-xl
      @click="close"
    />
    <div v-if="!files?.length" h-full w-full flex items-center justify-center>
      <label for="drop-zone-input" text-3xl hover="text-green cursor-pointer" transition-all>
        <VueIcon icon="i-carbon-cloud-upload" mr-2 /> Drop files here or click to select
      </label>
      <input
        id="drop-zone-input" type="file" multiple hidden
        @change="setFiles(($event.target as HTMLInputElement).files)"
      >
    </div>
    <div v-else relative h-full w-full grid="~ rows-[max-content_1fr_max-content]">
      <div px6 py6>
        <h1 text-2xl>
          Upload
        </h1>
        <p text-sm op50>
          Drag and drop files to upload
        </p>
      </div>
      <div grid="~ cols-minmax-8rem gap-8" overflow-auto p6>
        <div
          v-for="file, index of files" :key="file.name"
          flex="~ col gap-2" relative h-50 w-40 items-center
        >
          <div
            flex items-center justify-center of-hidden rounded rounded-t-lg bg-active object-cover
            class="aspect-1/1" border="~ base"
          >
            <img h-full w-full rounded-t-lg object-cover :src="blobIt(file)">
          </div>
          <div flex="~ gap1" items-center>
            <VueInput
              h-full flex-auto
              :model-value="file.name"
              @update:model-value="changeName(file, ($event.target as HTMLInputElement).value)"
            />
            <IconTitle
              icon="i-carbon-trash-can"
              h-full flex-none
              title="Remove file"
              @click="removeFile(index)"
            />
          </div>
        </div>
      </div>
      <div flex="~ gap-2" items-center justify-center p8>
        <VueButton v-if="files.length" @click="clearFiles">
          <VueIcon icon="i-carbon-clean" /> Clear
        </VueButton>
        <VueButton :disabled="!files.length" @click="uploadFiles">
          <VueIcon icon="i-carbon-cloud-upload" /> Upload
        </VueButton>
      </div>
    </div>
  </div>
</template>
