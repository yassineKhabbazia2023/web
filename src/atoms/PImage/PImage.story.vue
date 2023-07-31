<template>
  <Story
    title="2. Atoms/Image"
    :layout="{
      type: 'grid',
      width: 600,
    }"
    icon="mdi:file-image-outline">
    <Variant title="Basic Usage">
      <PImage
        :type="basicImageData.type"
        :name="basicImageData.name"
        :fit="basicImageData.fit" />
      <template #controls>
        <HstText
          v-model="basicImageData.type"
          title="type"
        />
        <HstText
          v-model="basicImageData.name"
          title="name"
        />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PImage from '.'
import { reactive } from 'vue'

const basicImageData = reactive({
  type: 'paupulse',
  name: 'digitalisation',
  fit: 'fill'
})
</script>

<docs lang="md">
  <div class="responsive-figma-container">
    <iframe class="responsive-figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FCmAQkyvJgicN6PHwf61DBZ%2F%25F0%259F%25A6%2584-Guidelines%3Ftype%3Ddesign%26node-id%3D71%253A226%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
