<script setup lang="ts">
import PImage from '.'
import { reactive } from 'vue'

const basicImageData = reactive({
  type: 'paupulse',
  name: 'digitalisation',
  fit: 'fill'
})

</script>

<template>
  <Story
    title="Atoms/Image"
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
