<template>
  <Story
    title="2. Atoms/DoubleText"
    icon="fluent:button-16-regular"
    :layout="{ type: 'grid', width: '350px' }"
  >
    <Variant title="Basic Usage" :source="source">
      <PDoubleText
        :pIcon="PIFiletypePdf"
        :pProfile="PDoubleTextBasicData.profile"
        :pTitle="PDoubleTextBasicData.title"
        :pContent="PDoubleTextBasicData.content"
        :pType="PDoubleTextBasicData.type"
        :pDisabled="PDoubleTextBasicData.disabled"
        :pSelected="PDoubleTextBasicData.selected"
      >
      </PDoubleText>
      <template #controls>
        <hstSelect
          v-model="PDoubleTextBasicData.type"
          title="Type"
          :options="typeOptions"
        />
        <HstText v-model="PDoubleTextBasicData.profile" title="Profile" />
        <HstText v-model="PDoubleTextBasicData.title" title="Title" />
        <HstText v-model="PDoubleTextBasicData.content" title="Content" />
        <HstCheckbox v-model="PDoubleTextBasicData.disabled" title="Disabled"/>
        <HstCheckbox v-model="PDoubleTextBasicData.selected" title="Selected" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PDoubleText from '.'
import { reactive } from 'vue'
import { PIFiletypePdf } from '../PIcon/components'
const type = 'primary' as 'primary' | 'secondary'

const PDoubleTextBasicData = reactive({
  icon: PIFiletypePdf,
  profile: 'FL',
  title: 'Cell title',
  content: 'Cell subtitle',
  type,
  disabled: false,
  selected: false,
})

const typeOptions = ['primary', 'secondary']

const source = `
import { PDoubleText } from '@pulse/styleguide'
  
<PDoubleText
  :title="Consectetur adpiscipiline'",
  :content="'Lorem ipsum dolor sit amet, consectetur adpiscipiline'"
  :type="'primary'"
  :disabled:= "false"
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
