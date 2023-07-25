<template>
  <Story title="Atoms/PDropdown" icon="radix-icons:margin">
    <Variant title="Basic usage simple">
      <PDropdown
v-model="valueSimple"
placeholder="Select"
size="large">
        <el-option
v-for="item in options"
:key="item.value"
:label="item.label"
:value="item.value" />
      </PDropdown>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PDropdown from '@/atoms/PDropdown'
import { ref } from 'vue'

const valueSimple = ref('')

const options = [
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  },
  {
    value: 'Option3',
    label: 'Option3'
  },
  {
    value: 'Option4',
    label: 'Option4'
  },
  {
    value: 'Option5',
    label: 'Option5'
  }
]
</script>

<docs lang="md">
## element plus component link
https://element-plus.org/en-US/component/select.html#option-slots
</docs>
