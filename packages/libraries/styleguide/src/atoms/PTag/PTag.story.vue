<template>
  <Story
    title="2. Atoms/Tag"
    :layout="{
      type: 'grid',
      width: 400,
    }"
    icon="mdi:tag-text-outline"
  >
    <Variant title="Basic usage">
      <PTag
        :pColor="color"
        :pSize="currentSize"
        :pEffect="currentTheme"
        :pIconLeft="tagBasicData.iconLeft"
        :pIconRight="tagBasicData.iconRight"
        :pContent="tagBasicData.content"
      />
      <template #controls>
        <HstRadio
          v-model="color"
          title="Tag Color"
          :options="tagColorList"
        />
        <HstRadio
          v-model="currentSize"
          title="Tag Sizes"
          :options="tagSizeList"
        />
        <HstRadio
          v-model="currentTheme"
          title="Theme"
          :options="themeList"
        />
      </template>
    </Variant>
    <Variant title="Removable Tag">
      <PTag
        :pClosable="closable"
        :pColor="color"
        pEffect="plain"
        :pDisableTransitions="disableTransitions"
        @close="fireClose"
        :pIconLeft="tagBasicData.iconLeft"
        :pIconRight="tagBasicData.iconRight"
        :pContent="tagBasicData.content"
      />
      <template #controls>
        <HstRadio
          v-model="color"
          title="Tag Color"
          :options="tagColorList"
        />
        <HstCheckbox v-model="closable" title="closable" />
        <HstCheckbox v-model="disableTransitions" title="disableTransitions" />
      </template>
    </Variant>
    <Variant title="Rounded">
      <PTag
        :pColor="color"
        :pEffect="currentTheme"
        :pRound="rounded"
        :pIconLeft="tagBasicData.iconLeft"
        :pIconRight="tagBasicData.iconRight"
        :pContent="tagBasicData.content">
      </PTag>
      <template #controls>
        <HstRadio
          v-model="color"
          title="Tag Color"
          :options="tagColorList"
        />
        <HstButtonGroup
          v-model="currentTheme"
          title="Theme"
          :options="themeList"
        />
        <HstCheckbox v-model="rounded" title="rounded" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PTagProps } from './PTagTypes'
import { logEvent } from 'histoire/client'
import { PIStars } from '@/atoms/PIcon/components'

const color = ref('success')
const closable = ref(true)
const rounded = ref(true)
const disableTransitions = ref(true)
const tagBasicData = {
  content: 'My tag',
  iconLeft: PIStars,
  iconRight: PIStars,
}

const tagColorList: { label: string, value: PTagProps['pColor'] }[] = [
  {
    label: 'default',
    value: '',
  },
  {
    label: 'success',
    value: 'success',
  },
  {
    label: 'warning',
    value: 'warning',
  },
  {
    label: 'danger',
    value: 'danger',
  },
  {
    label: 'info',
    value: 'info',
  },
  {
    label: 'persian',
    value: 'persian',
  },
  {
    label: 'fuschia',
    value: 'fuschia',
  },
  {
    label: 'amethyste',
    value: 'amethyste',
  },
  {
    label: 'cyan',
    value: 'cyan',
  },
  {
    label: 'gray-500',
    value: 'gray-500',
  },
  {
    label: 'gray-900',
    value: 'gray-900',
  },
  {
    label: 'gray-300 / disable',
    value: 'gray-300',
  },
]
const currentSize = ref<PTagProps['pSize']>('default')
const tagSizeList: { label: string, value: PTagProps['pSize'] }[] = [
  {
    label: 'large',
    value: 'large',
  },
  {
    label: 'default',
    value: 'default',
  },
  {
    label: 'small',
    value: 'small',
  },
]
const themeList: { label: string, value: PTagProps['pEffect'] }[] = [
  {
    label: 'Dark',
    value: 'dark',
  },
  {
    label: 'Light',
    value: 'light',
  },
  {
    label: 'Plain',
    value: 'plain',
  },
]
const currentTheme = ref<PTagProps['pEffect']>('light')
function fireClose(e: Event) {
  logEvent('close', e)
}
</script>

<docs lang="md">
## Basic usage

Tag usage

## Removable Tag

closable attribute can be used to define a removable tag. It accepts a Boolean. By default the removal of Tag has a fading animation. If you don't want to use it, you can set the disable-transitions attribute, which accepts a Boolean, to true. close event triggers when Tag is removed.

## Edit Dynamically

You can use the close event to add and remove tag dynamically.

## Theme

Tag provide three different themes: dark、light and plain

Using effect to change, default is light

<div class="responsive-iframe-container">
  <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D294%253A561%26mode%3Ddev" allowfullscreen></iframe>
</div>

## Checkable tag

Sometimes because of the business needs, we might need checkbox like tag, but button like checkbox cannot meet our needs, here comes check-tag

basic check-tag usage, the API is rather simple.
</docs>
