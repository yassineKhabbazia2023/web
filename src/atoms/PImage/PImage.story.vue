<template>
  <Story
    title="2. Atoms/Image"
    :layout="{
      type: 'grid',
      width: 600,
    }"
    icon="mdi:file-image-outline"
  >
    <Variant title="Basic Usage">
      <PImage
        :pType="basicImageData.pType"
        :pName="basicImageData.pName"
        :fit="basicImageData.pFit" />
      <template #controls>
        <HstText
          v-model="basicImageData.pType"
          title="type"
        />
        <HstText
          v-model="basicImageData.pName"
          title="name"
        />
        <hr />
        <div class="margin--2 margin-top--4">
          <p>
            <strong>Only svg will work.</strong><br />
            <small>
              You can test others formats by going to an url like https://cdn.dev.kpmg-pulse.fr/mail/account-creation.jpg for example.
            </small>
          </p>
          <p class="margin-top--4">
            Below it s the actual list of all folders with images (including extension) inside: <pre>{{ IMAGES_LIST }}</pre>
          </p>
        </div>
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import PImage from '.'

const basicImageData = reactive({
  type: 'paupulse',
  name: 'digitalisation',
  fit: 'fill'
})
</script>

<docs lang="md">
  <div class="responsive-figma-container">
    <iframe
      class="responsive-figma"
      src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FCmAQkyvJgicN6PHwf61DBZ%2F%25F0%259F%25A6%2584-Guidelines%3Ftype%3Ddesign%26node-id%3D71%253A226%26mode%3Ddev"
      allowfullscreen
    ></iframe>
  </div>
</docs>
