<script setup lang="ts">
import DarkToggle from './components/DarkToggle.vue'
</script>

<template>
  <div class="flex flex-col justify-center">
    <div class="text-center">
      <RouterView />
    </div>
    <div class="text-center">
      Router Navgation:
      <RouterLink to="/">
        <span>
          /
        </span>
      </RouterLink>
      |
      <RouterLink to="/hello">
        <span>
          /hello
        </span>
      </RouterLink>
      |
      <RouterLink to="/hey/123123">
        <span>
          /hey/123123
        </span>
      </RouterLink>
    </div>
    <div text-center>
      <DarkToggle />
    </div>
  </div>
</template>
