<script setup lang="ts">
const timelineEvent = [
  {
    title: '🛫 setNewName',
    subtitle: 'start',
    time: '10:20:10',
  },
  {
    title: 'mutation',
    subtitle: 'set',
    time: '10:20:10',
  },
  {
    title: '🛬 setNewName',
    subtitle: 'end',
    time: '10:20:10',
  },
]
</script>

<template>
  <div class="p3">
    <ul>
      <li v-for="(item, index) in timelineEvent" :key="index" class="relative mb7 h6">
        <!-- head -->
        <span class="absolute top-1.5 inline-block h3 w3 rounded-50%" border="3px solid green" />
        <!-- line -->
        <span v-if="index < timelineEvent.length - 1" class="absolute left-5px top-4.5 h10 w0 border-l-2" border="solid gray2" />
        <!-- content -->
        <p class="h-full flex items-center truncate pl5">
          <span absolute top-4.5 pr2 text-3 op40>[{{ item.time }}]</span>
          {{ item.title }}
          <span pl2 op30>{{ item.subtitle }}</span>
        </p>
      </li>
    </ul>
  </div>
</template>
