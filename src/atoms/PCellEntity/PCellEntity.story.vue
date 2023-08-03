<template>
  <Story
    title="2. Atoms/CellEntity"
    icon="fluent:button-16-regular"
    :layout="{ type: 'grid', width: '300px' }"
    >>
    <Variant title="Basic Usage" :source="source">
      <PCellEntity
        :content="pCellTextBasicData.content"
        :type="pCellTextBasicData.type"
        :selected="pCellTextBasicData.selected"
      >
      </PCellEntity>
      <template #controls>
        <hstSelect
          v-model="pCellTextBasicData.type"
          title="Type"
          :options="typeOptions"
        />
        <HstText v-model="pCellTextBasicData.content" title="Content" />
        <HstCheckbox v-model="pCellTextBasicData.selected" title="Selected" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PCellEntity from '.'
import { reactive } from 'vue'

const type = 'primary' as 'primary' | 'secondary'

const pCellTextBasicData = reactive({
  content: 'Lorem ipsum dolor sit amet, consectetur adpiscipiline',
  type,
  selected: false
})

const typeOptions = ['primary', 'secondary']

const source = `
import { PCellEntity } from '@kpmg/styleguide'
  
<PCellEntity
  :content="'Lorem ipsum dolor sit amet, consectetur adpiscipiline'"
  :type="'primary'"
  :selected:= "false"
/>
`
</script>

<docs lang="md">
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" width="800" height="450"
      src="https://www.figma.com/embed?embed_host=sastdstorybook.z28.web.core.windows.net&amp;url=
      https://www.figma.com/file/hycpUsOrc1fFD7xcYY0ryN/%F0%9F%A6%84-Librairie-de-composants
      ?type=design&node-id=605-2162&mode=design&t=s4LIgE2MBLqGC6Ju-0">
    </iframe>
  </div>
</docs>
