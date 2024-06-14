<script lang="ts">
const getCircularState = () => {
  const obj = {
    a: 1,
    b: 2,
  }
  // @ts-expect-error - Circular reference
  obj.c = obj
  return obj
}

export default {
  provide() {
    return {
      $currentInstance: this,
      $currentInstance2: this,
    }
  },
  data() {
    return {
      circularState: getCircularState(),
    }
  },
}
</script>

<template>
  <div />
</template>
