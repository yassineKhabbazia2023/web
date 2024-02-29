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
          :options="folderNames"
        />
        <HstSelect
          v-model="basicImageData.name"
          title="Name"
          :options="imageNames"
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
            Below it s the actual list of all folders with images :
            <ul>
              <li
                v-for="(folder, folderIndex) in IMAGES_LIST"
                :key="`folder-${folderIndex}`"
                class="margin-top--2 cursor-pointer"
                @click.stop="onClickImage(folder.name)"
              >
                <strong>pType="{{ folder.name }}"</strong>
                <ul>
                  <li
                    class="padding-left--2 padding-top--1 cursor-pointer"
                    v-for="(image, imageIndex) in folder.images"
                    :key="`folder-${folderIndex}-image-${imageIndex}`"
                    @click.stop="onClickImage(folder.name, image)"
                  >
                    pName="{{ image }}"
                  </li>
                </ul>
              </li>
            </ul>
          </p>
        </div>
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import {
  onMounted,
  computed,
  defineAsyncComponent,
  reactive,
  toRaw,
  watch
} from 'vue'
import IMAGES_LIST from './imagesList.json'

const folderNames = IMAGES_LIST.map(({ name }) => name)
const imageNames = computed(() => {
  const folder = IMAGES_LIST.find(({ name }) => name === basicImageData.type)
  return folder?.images ?? []
})

const basicImageData = reactive<{
  type: string,
  name: string,
  fit: string,
}>({
  type: IMAGES_LIST[0].name,
  name: IMAGES_LIST[0].images[0],
  fit: 'fill'
})

let AsyncComponent: any

const loadImage = () => {
  AsyncComponent = defineAsyncComponent(() => import('./'))
}

function onClickImage(folderName: string, imageName = '') {
  basicImageData.type = folderName
  basicImageData.name = imageName
}

watch(basicImageData, (newValue) => {
  const hasFileInFolder = imageNames.value.includes(toRaw(newValue.name))
  if (hasFileInFolder) {
    loadImage()
  }
})

onMounted(() => {
  loadImage()
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
