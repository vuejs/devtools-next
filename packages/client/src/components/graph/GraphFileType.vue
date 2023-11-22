<script setup lang="ts">
const { fileTypeData, fileTypeShow, toggleFileType } = useFileTypes()
</script>

<template>
  <div
    absolute bottom-0 px4 py2 rounded-tr-lg w-260px grid gap-2 grid-cols-3 bg-base b-1 border-base
    transition-transform duration-300
    :class="[
      fileTypeShow ? 'translate-y-0' : 'translate-y-full',
    ]"
  >
    <div
      absolute top-0 translate-y="-100%" px4 py1 bg-primary-500 text-white rounded-tr-lg cursor-pointer class="group"
      transition-opacity @click="() => toggleFileType()"
    >
      File Type <div
        :class="[
          fileTypeShow
            ? 'group-hover:translate-y-10% rotate-180'
            : 'group-hover:translate-y--10%',
        ]" transition-transform i-material-symbols:arrow-upward-alt-rounded
      />
    </div>
    <div v-for="item of fileTypeData" :key="item.key" flex gap-2 items-center>
      <div
        rounded-full w12px h12px :style="{
          backgroundColor: item.color,
        }"
      />
      <span
        :class="[
          item.capitalize ? 'capitalize' : 'uppercase',
        ]"
      >{{ item.key }}</span>
    </div>
  </div>
</template>
