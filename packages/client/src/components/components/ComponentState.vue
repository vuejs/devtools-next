<script setup lang="ts">
const data = [
  {
    key: 'count',
    value: 0,
    type: 'literal',
    editable: true,
    dataType: 'ref',
    dataTypeName: 'Ref',
  },
  {
    key: 'name',
    value: 'Vue Devtools',
    type: 'string',
    editable: true,
    dataType: 'ref',
    dataTypeName: 'Ref',
  },
  {
    key: '$route',
    value: 'Router',
    type: 'object',
    children: [
      {
        key: 'count',
        value: 0,
        type: 'literal',
        editable: true,
        dataType: 'ref',
        dataTypeName: 'Ref',
      },
      {
        key: 'name',
        value: 'Vue Devtools',
        type: 'string',
        editable: true,
        dataType: 'ref',
        dataTypeName: 'Ref',
      },
    ],
    editable: true,
  },
]
</script>

<template>
  <div class="selectable-item group w-full px-0">
    <ExpandIcon :value="true" group-hover:text-white />
    <span text-primary-400 group-hover:text-white class="text-[#486887] dark:(text-[#7595b5])">
      Setup
    </span>
  </div>
  <ComponentStateType :data="data" />
</template>
