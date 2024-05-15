<script setup>
import { useForm } from 'vee-validate'

// Validation, or use `yup` or `zod`
function required(value) {
  return value ? true : 'This field is required'
}

// Create the form
const { defineField, handleSubmit, errors } = useForm({
  validationSchema: {
    field: required,
  },
})

// Define fields
const [field, fieldProps] = defineField('field')

// Submit handler
const onSubmit = handleSubmit((values) => {
  // Submit to API
  console.log(values)
})
</script>

<template>
  <form @submit="onSubmit">
    <input v-model="field" v-bind="fieldProps">
    <span>{{ errors.field }}</span>

    <button>Submit</button>
  </form>
</template>
