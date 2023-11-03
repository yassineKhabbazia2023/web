<template>
  <Story
    title="2. Atoms/Entity"
    icon="fluent:button-16-regular"
    :layout="{ type: 'grid', width: '300px' }"
    >
    <Variant title="Basic Usage" :source="source">
      <PEntity
        :pContent="PTextBasicData.content"
        :pType="PTextBasicData.type"
        :pSelected="PTextBasicData.selected"
        :pIcon="PIPulse"
      >
      </PEntity>
      <template #controls>
        <hstSelect
          v-model="PTextBasicData.type"
          title="Type"
          :options="typeOptions"
        />
        <HstText v-model="PTextBasicData.content" title="Content" />
        <HstCheckbox v-model="PTextBasicData.selected" title="Selected" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PEntity from '.'
import { reactive } from 'vue'
import { PIPulse } from '../PIcon/components'

const type = 'primary' as 'primary' | 'secondary'

const PTextBasicData = reactive({
  content: 'Lorem ipsum dolor sit amet, consectetur adpiscipiline',
  type,
  selected: false
})

const typeOptions = ['primary', 'secondary']

const source = `
import { PEntity } from '@kpmg/styleguide'
  
<PEntity
  :pContent="'Lorem ipsum dolor sit amet, consectetur adpiscipiline'"
  :pType="'primary'"
  :pSelected= "false"
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
