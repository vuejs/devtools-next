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
    key: 'list',
    value: 'Array[6]',
    type: 'array',
    children: [
      {
        key: '0',
        value: 0,
        type: 'literal',
        editable: true,
        dataType: 'ref',
        dataTypeName: 'Ref',
      },
      {
        key: '1',
        value: 1,
        type: 'literal',
        editable: true,
        dataType: 'ref',
        dataTypeName: 'Ref',
      },
    ],
    editable: true,
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
