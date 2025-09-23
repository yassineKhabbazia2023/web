<template>
  <Story
    title="2. Atoms/Tag"
    :layout="{
      type: 'single'
    }"
    icon="mdi:tag-text-outline"
  >
    <Variant title="Basic usage">
      <PTag
        :pColor="color"
        :pSize="currentSize"
        :pIconLeftName="pIconLeftName"
        :pIconRightName="pIconRightName"
        :pContent="pContent"
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
      </template>
    </Variant>
    <Variant title="Removable Tag">
      <PTag
        :pClosable="closable"
        :pColor="color"
        :pDisableTransitions="disableTransitions"
        :pIconLeftName="pIconLeftName"
        :pIconRightName="pIconRightName"
        :pContent="pContent"
        @close="fireClose"
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
        :pRound="rounded"
        :pIconLeftName="pIconLeftName"
        :pIconRightName="pIconRightName"
        :pContent="pContent"
      />
      <template #controls>
        <HstRadio
          v-model="color"
          title="Tag Color"
          :options="tagColorList"
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
import PTag from '../../atoms/PTag'

const color = ref<PTagProps['pColor']>('success')
const closable = ref(true)
const rounded = ref(true)
const disableTransitions = ref(true)

const pContent = ref<PTagProps['pContent']>('My tag')
const pIconLeftName = ref<PTagProps['pIconLeftName']>('stars')
const pIconRightName = ref<PTagProps['pIconRightName']>('stars')

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
