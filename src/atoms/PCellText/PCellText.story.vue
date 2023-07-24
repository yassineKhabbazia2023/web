<template>
  <Story
  title="Atoms/PCellText"
  icon="fluent:button-16-regular"
  :layout="{ type: 'grid', width: '300px' }">>
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
import PCellText from './PCellText.vue'
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
<iframe
  src="https://www.figma.com/embed?embed_host=sastdstorybook.z28.web.core.windows.net&amp;url=
  https://www.figma.com/file/hycpUsOrc1fFD7xcYY0ryN/%F0%9F%A6%84-Librairie-de-composants
  ?type=design&node-id=605-2162&mode=design&t=s4LIgE2MBLqGC6Ju-0">
</iframe>
</docs>
