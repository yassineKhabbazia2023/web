<template>
  <Story
    title="2. Atoms/Image"
    :layout="{
      type: 'grid',
      width: 600,
    }"
    icon="mdi:file-image-outline"
  >
    icon="mdi:file-image-outline"
  >
    <Variant title="Basic Usage">
      <Suspense>
        <AsyncComponent
          :pType="basicImageData.type"
          :pName="basicImageData.name"
          :pFit="basicImageData.fit"
        />
      </Suspense>

      <template #controls>
        <HstSelect
          v-model="basicImageData.type"
          title="Type"
          :options="folders"
        />
        <HstSelect
          v-model="basicImageData.name"
          title="Name"
          :options="filesName"
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
import {
  computed,
  defineAsyncComponent,
  reactive,
  toRaw,
  watch
} from 'vue'
import IMAGES_LIST from '@/assets/images/imagesList.json'

const basicImageData = reactive({
  type: 'paupulse',
  name: 'digitalisation',
  fit: 'fill'
})

const folders = IMAGES_LIST.map(folder => Object.keys(folder)[0])
const files = computed(() =>
  IMAGES_LIST.find(folder => Object.keys(folder)[0] === basicImageData.type)
)

const filesName = computed(() =>
  Object
    .values(files.value as object)[0]
    .map((file: string) => file.split('.')[0])
)

let AsyncComponent: any

const loadImage = () => {
  AsyncComponent = defineAsyncComponent(() => import('./'))
}
loadImage()

watch(basicImageData, (newValue) => {
  const hasFileInFolder = filesName.value.includes(toRaw(newValue.name))
  if (hasFileInFolder) {
    loadImage()
  }
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
