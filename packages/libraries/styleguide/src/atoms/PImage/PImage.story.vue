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
        <PImage
          v-if="imageName"
          :pName="imageName"
          :pFit="imageFit"
        />
      </Suspense>

      <template #controls>
        <HstSelect
          v-model="imageFolder"
          title="Type"
          :options="folderNames"
        />
        <HstSelect
          v-model="imageName"
          title="Name"
          :options="folders[imageFolder]"
        />
        <HstSelect
          v-model="imageFit"
          title="Fit"
          :options="imageFitList"
        />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PImage from '.'
import imagesList from './imagesList.json'
import type { PImageProps } from './PImageTypes'
import type { ImageName } from '../../types/ImageName.types'

function getNames(imagesList: Record<string, string>) {
  const imageNames: ImageName[] = Object.keys(imagesList) as ImageName[]
  const folders = imageNames
    .reduce((folders, imageName) => {
      const imagePath: string = imagesList[imageName]
      const splitted = imagePath.split('/')
      const folderName = splitted.at(0) ?? ''

      if (folderName) {
        if (folders[folderName]) {
          folders[folderName].push(imageName)
        } else {
          folders[folderName] = [imageName]
        }
      }

      return folders
    }, {} as Record<string, string[]>)

  return {
    imageNames,
    folders,
  }
}
const {
  imageNames,
  folders,
} = getNames(imagesList)

const folderNames = Object.keys(folders)
const imageFitList: PImageProps['pFit'][] = [
  '',
  'fill',
  'contain',
  'cover',
  'none',
  'scale-down',
]
const imageFolder = ref<string>(folderNames.at(0) ?? '')
const imageName = ref<ImageName | undefined>(imageNames.at(0))
const imageFit = ref<PImageProps['pFit']>(imageFitList.at(0))

</script>
