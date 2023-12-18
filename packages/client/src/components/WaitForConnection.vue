<script setup lang="ts">
import AppConnecting from '~/components/AppConnecting.vue'
</script>

<template>
  <div class="h-screen w-screen $ui-fcc">
    <AppConnecting>
      <p class="pt-5 font-bold text-base">
        Waiting for connection...
      </p>
    </AppConnecting>
  </div>
</template>

<style scoped>

</style>
