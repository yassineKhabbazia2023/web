<template>
  <Story title="2. Atoms/Radio" icon="material-symbols:radio-button-checked-outline">
    <Variant title="Basic Usage">
      <PRadio
        v-model="radio"
        pLabel="1"
        :pDisabled="isDisabled">
        Option 1
      </PRadio>
      <PRadio
        v-model="radio"
        pLabel="2"
        :pDisabled="isDisabled">
        Option 2
      </PRadio>
      <template #controls>
        <HstCheckbox v-model="isDisabled" title="Disabled" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const radio = ref('1')
const isDisabled = ref(false)
</script>

<docs lang="md">
## Basic usage
radio usage

<div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D546%253A1007%26mode%3Ddesign%26t%3D60Up4Pe6thRC92Ns-1" allowfullscreen></iframe>
  </div>
</docs>
