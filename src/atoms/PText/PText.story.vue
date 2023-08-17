<template>
  <Story
  title="2. Atoms/Text"
  icon="fluent:button-16-regular"
  :layout="{ type: 'grid', width: '300px' }">
    <Variant title="PText" :source="source">
      <PText
         :content="PTextBasicData.content"
         :icon="PIPerson"
         :bold="PTextBasicData.bold"
         :type="PTextBasicData.type"
         :disabled="PTextBasicData.disabled"
         :selected="PTextBasicData.selected"
         >
        </PText>
      <template #controls>
        <hstSelect
          v-model="PTextBasicData.type"
          title="Type"
          :options="typeOptions"
        />
        <HstText v-model="PTextBasicData.content" title="Content"/>
        <HstCheckbox v-model="PTextBasicData.bold" title="Bold"/>
        <HstCheckbox v-model="PTextBasicData.disabled" title="Disabled"/>
        <HstCheckbox v-model="PTextBasicData.selected" title="Selected"/>
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PText from './'
import { reactive } from 'vue'
import { PIPerson } from '../PIcon/components'

const type = 'primary' as 'primary' | 'secondary' | 'drag'

const PTextBasicData = reactive({
  content: 'Lorem ipsum dolor sit amet, consectetur adpiscipiline',
  icon: PIPerson,
  type,
  bold: false,
  disabled: false,
  selected: false
})

const typeOptions = [
  'primary',
  'secondary',
  'drag'
]

const source = `
import { PIPerson } from '@kpmg/styleguide'

<PTooltip
  :content="'Lorem ipsum dolor sit amet, consectetur adpiscipiline'"
  :icon="PIPerson"
  :bold="false"
  :background="false"
/>
`
</script>

<docs lang="md">
<div class="responsive-iframe-container">
  <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D605%253A2161%26mode%3Ddev" allowfullscreen></iframe>
</div>
</docs>
