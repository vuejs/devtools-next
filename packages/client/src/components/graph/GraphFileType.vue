<script setup lang="ts">
const { fileTypeData, fileTypeShow, toggleFileType } = useFileTypes()
</script>

<template>
  <div
    absolute bottom-0 px4 py2 rounded-tr-lg w-260px grid gap-2 grid-cols-3 bg-base b-1 border-base
    transition-transform duration-300
    class="group"
    :class="{
      'translate-x-[calc(-100%+30px)] translate-y-[calc(100%-30px)]': !fileTypeShow,
    }"
  >
    <div
      absolute right-0 bg-primary-500 text-white rounded-tr-lg cursor-pointer class="group"
      transition-opacity w30px h30px flex="~ justify-center items-center"
      :class="{
        'rounded-bl-lg opacity-0 group-hover:opacity-100': fileTypeShow,
      }"
      @click="() => toggleFileType()"
    >
      <div
        transition-transform
        :class="[
          fileTypeShow
            ? 'i-material-symbols-arrow-downward-alt rotate-45 hover:(translate-x--10% translate-y-10%)'
            : 'i-mdi-file-outline',
        ]"
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
