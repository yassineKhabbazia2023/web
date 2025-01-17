<template>
  <Story
    title="2. Atoms/Text"
    icon="fluent:button-16-regular"
    :layout="{ type: 'grid', width: '300px' }"
  >
    <Variant title="PText">
      <PText
        :pContent="PTextBasicData.content"
        :pIcon="icon"
        :pBold="PTextBasicData.bold"
        :pType="PTextBasicData.type"
        :disabled="PTextBasicData.disabled"
        :selected="PTextBasicData.selected"
      />
      <template #controls>
        <hstSelect
          v-model="PTextBasicData.type"
          title="Type"
          :options="typeOptions"
        />
        <HstText v-model="PTextBasicData.content" title="Content" />
        <HstCheckbox v-model="PTextBasicData.bold" title="Bold" />
        <HstCheckbox v-model="PTextBasicData.disabled" title="Disabled" />
        <HstCheckbox v-model="PTextBasicData.selected" title="Selected" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { PIPerson } from '../../atoms/PIcon/components'
import type { PTextProps } from './PTextTypes'
import PText from './'
import { getIconComponent } from '../../utils/iconHelper'

const PTextBasicData = reactive({
  content: 'Lorem ipsum dolor sit amet, consectetur adpiscipiline',
  type: ref<PTextProps['pType']>('primary'),
  bold: false,
  disabled: false,
  selected: false,
})

const typeOptions = [
  'primary',
  'secondary',
  'drag',
]

const icon = computed(() => getIconComponent('person'))
</script>

<docs lang="md">
<div class="responsive-iframe-container">
  <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D605%253A2161%26mode%3Ddev" allowfullscreen></iframe>
</div>
</docs>
