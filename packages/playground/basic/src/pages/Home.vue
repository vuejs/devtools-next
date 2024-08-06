<script setup lang="ts">
import Foo from '../components/Foo.vue'

const visible = ref(false)

const obj = reactive<{
  count: number
  foo?: number
  bar?: string
}>({
  count: 0,
})

// @ts-expect-error type guard
obj.foo = toRef(obj, 'count')
// @ts-expect-error type guard
obj.bar = ref('bar')

const toRefObj = toRefs(obj)
</script>

<template>
  <div class="m-auto mt-3 h-80 w-120 flex flex-col items-center justify-center rounded bg-[#363636]">
    Home
    <Foo v-if="visible" />
    <img src="/vite.svg" alt="Vite Logo">
    <button class="w-30 cursor-pointer" @click="visible = !visible">
      Toggle Foo
    </button>
  </div>
</template>

<style lang="scss" scoped>

</style>
