<template>
  <Story
  title="2. Atoms/CellText"
  icon="fluent:button-16-regular"
  :layout="{ type: 'grid', width: '300px' }">
    <Variant title="PCellText" :source="source">
      <PCellText
         :content="pCellTextBasicData.content"
         :icon="PIPerson"
         :bold="pCellTextBasicData.bold"
         :type="pCellTextBasicData.type"
         :disabled="pCellTextBasicData.disabled"
         :selected="pCellTextBasicData.selected"
         >
        </PCellText>
      <template #controls>
        <hstSelect
          v-model="pCellTextBasicData.type"
          title="Type"
          :options="typeOptions"
        />
        <HstText v-model="pCellTextBasicData.content" title="Content"/>
        <HstCheckbox v-model="pCellTextBasicData.bold" title="Bold"/>
        <HstCheckbox v-model="pCellTextBasicData.disabled" title="Disabled"/>
        <HstCheckbox v-model="pCellTextBasicData.selected" title="Selected"/>
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PCellText from './'
import { reactive } from 'vue'
import { PIPerson } from '../PIcon/components'

const type = 'primary' as 'primary' | 'secondary' | 'drag'

const pCellTextBasicData = reactive({
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
