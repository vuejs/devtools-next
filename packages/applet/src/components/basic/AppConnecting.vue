<script setup lang="ts">
</script>

<template>
  <div class="h-screen w-screen $ui-fcc flex-col">
    <div class="outer">
      <div class="inner">
        <i class="i-logos-vue inline-block h8! w8!" alt="Vue logo" />
      </div>
    </div>
    <slot />
  </div>
</template>

<style scoped>
@keyframes connecting {
  0% {
    --at-apply: opacity-60 scale-60;
  }
  50% {
    --at-apply: opacity-80 scale-80;
  }
  100% {
    --at-apply: opacity-100 scale-100;
  }
}

.outer,
.inner {
  --at-apply: transform rounded-[50%] bg-primary-500 bg-opacity-10;
}
.outer {
  --at-apply: p-6;
  animation: connecting 1.2s linear infinite;
}

.inner {
  --at-apply: pt-6 pr-5 pb-4 pl-5;
  animation: connecting 1.2s 0.1s backwards linear infinite;
}
</style>
