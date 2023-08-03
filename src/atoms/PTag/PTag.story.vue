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
        :type="currentType"
        :size="currentSize"
        :effect="currentTheme">
        <PIcon class="el-tag__icon--left">
          <PIFolder />
        </PIcon>
        Tag
        <PIcon class="el-tag__icon--right">
          <PIStars />
        </PIcon>
      </PTag>
      <template #controls>
        <HstRadio
          v-model="currentType"
          title="Tag Type"
          :options="tagTypeList" />
        <HstRadio
          v-model="currentSize"
          title="Tag Sizes"
          :options="tagSizeList" />
        <HstRadio
          v-model="currentTheme"
          title="Theme"
          :options="ThemeList" />
      </template>
    </Variant>
    <Variant title="Removable Tag">
      <PTag
        :closable="closable"
        :type="currentType"
        effect="plain"
        :disableTransitions="disableTransitions"
        @close="fireClose">
        Removable Tag
      </PTag>
      <template #controls>
        <HstRadio
          v-model="currentType"
          title="Tag Type"
          :options="tagTypeList" />
        <HstCheckbox v-model="closable" title="closable" />
        <HstCheckbox v-model="disableTransitions" title="disableTransitions" />
      </template>
    </Variant>
    <Variant title="Edit Dynamically">
      <PTag
        v-for="tag in dynamicTags"
        :key="tag"
        :closable="closable"
        :disableTransitions="disableTransitions"
        style="margin:0 5px;"
        @close="handleClose(tag)">
        {{ tag }}
      </PTag>
      <PInput
        v-if="inputVisible"
        ref="InputRef"
        v-model="inputValue"
        style="margin-left:10px;width:120px;"
        size="small"
        type="primary"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm" />
      <PButton
        v-else
        class="button-new-tag ml-1"
        type="primary"
        plain
        size="small"
        @click="showInput">
          + New Tag
      </PButton>
      <template v-if="dynamicTags.length > 0" #controls>
        <HstCheckbox v-model="closable" title="closable" />
        <HstCheckbox v-model="disableTransitions" title="disableTransitions" />
      </template>
    </Variant>
    <Variant title="Rounded">
      <PTag
        :type="currentType"
        :effect="currentTheme"
        :round="rounded">
        Tag
      </PTag>
      <template #controls>
        <HstRadio
          v-model="currentType"
          title="Tag Type"
          :options="tagTypeList" />
        <HstButtonGroup
          v-model="currentTheme"
          title="Theme"
          :options="ThemeList"
        />
        <HstCheckbox v-model="rounded" title="rounded" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import type { PTagProps } from './PTag'
import { logEvent } from 'histoire/client'
import PInput from '@/atoms/PInput'

const currentType = ref('success')
const closable = ref(true)
const rounded = ref(true)
const disableTransitions = ref(true)
const tagTypeList: { label: string; value: PTagProps['type'] }[] = [
  {
    label: 'default',
    value: ''
  },
  {
    label: 'success',
    value: 'success'
  },
  {
    label: 'warning',
    value: 'warning'
  },
  {
    label: 'danger',
    value: 'danger'
  },
  {
    label: 'info',
    value: 'info'
  },
  {
    label: 'persian',
    value: 'persian'
  },
  {
    label: 'fuschia',
    value: 'fuschia'
  },
  {
    label: 'amethyste',
    value: 'amethyste'
  },
  {
    label: 'cyan',
    value: 'cyan'
  },
  {
    label: 'gray-500',
    value: 'gray-500'
  },
  {
    label: 'gray-900',
    value: 'gray-900'
  },
  {
    label: 'gray-300 / disable',
    value: 'gray-300'
  }
]
const currentSize = ref<PTagProps['size']>('default')
const tagSizeList: { label: string; value: PTagProps['size'] }[] = [
  {
    label: 'large',
    value: 'large'
  },
  {
    label: 'default',
    value: 'default'
  },
  {
    label: 'small',
    value: 'small'
  }
]
const ThemeList: { label: string; value: PTagProps['effect'] }[] = [
  {
    label: 'Dark',
    value: 'dark'
  },
  {
    label: 'Light',
    value: 'light'
  },
  {
    label: 'Plain',
    value: 'plain'
  }
]
const dynamicTags = ref(['Tag 1', 'Tag 2', 'Tag 3'])
const currentTheme = ref<PTagProps['effect']>('light')
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof PInput>>()
function handleClose(tag: string) {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}
function showInput() {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value?.$emit('focus')
  })
}

function handleInputConfirm() {
  if (inputValue.value) { dynamicTags.value.push(inputValue.value) }

  inputVisible.value = false
  inputValue.value = ''
}
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
