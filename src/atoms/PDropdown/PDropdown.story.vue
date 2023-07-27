<template>
  <Story title="2. Atoms/Dropdown" icon="radix-icons:margin">
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
import PDropdown from '.'
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
<div class="responsive-figma-container">
  <iframe class="responsive-figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D548%253A1136%26mode%3Ddev" allowfullscreen></iframe>
</div>
</docs>
