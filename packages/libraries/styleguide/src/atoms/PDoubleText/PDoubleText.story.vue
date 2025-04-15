<template>
  <Story
    title="2. Atoms/DoubleText"
    icon="fluent:button-16-regular"
    :layout="{ type: 'grid', width: '350px' }"
  >
    <Variant title="Basic Usage">
      <PDoubleText
        :pIconName="pIconName"
        :pProfile="pProfile"
        :pTitle="pTitle"
        :pContent="pContent"
        :pIconColor="pIconColor"
        :pIconType="pIconType"
        :pType="pType"
        :pSelected="pSelected"
        :pDisabled="pDisabled"
        :pBold="pBold"
      />
      <template #controls>
        <HstText v-model="pIconName" title="pIconName" />
        <HstText v-model="pProfile" title="pProfile" />
        <HstText v-model="pTitle" title="pTitle" />
        <HstText v-model="pContent" title="pContent" />

        <hstSelect
          v-model="pIconColor"
          title="pIconColor"
          :options="pIconColors"
        />
        <HstSelect
          v-model="pIconType"
          title="pIconType"
          :options="pIconTypes"
        />
        <HstSelect
          v-model="pType"
          title="pType"
          :options="pTypes"
        />

        <HstCheckbox v-model="pDisabled" title="pDisabled" />
        <HstCheckbox v-model="pSelected" title="pSelected" />
        <HstCheckbox v-model="pBold" title="pBold" />
      </template>
    </Variant>
    <Variant title="Avatar Role Usage">
      <PDoubleText
        :pAvatarRole="AvatarRoles.CLIENT"
        :pProfile="pProfile"
        pTitle="Client"
        :pType="pType"
      />
      <PDoubleText
        :pAvatarRole="AvatarRoles.COLLAB"
        :pProfile="pProfile"
        pTitle="Collaborator"
        :pType="pType"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PDoubleText from '.'
import { ref } from 'vue'
import type { PDoubleTextProps } from './PDoubleTextTypes'
import { AvatarRoles } from '../../utils/avatar.roles'

const pIconName = ref<PDoubleTextProps['pIconName']>('filetypePdf')
const pProfile = ref<PDoubleTextProps['pProfile']>('FL')
const pTitle = ref<PDoubleTextProps['pTitle']>('Cell title')
const pContent = ref<PDoubleTextProps['pContent']>('Cell subtitle')
const pIconColor = ref<PDoubleTextProps['pIconColor']>()
const pIconType = ref<PDoubleTextProps['pIconType']>('small')
const pType = ref<PDoubleTextProps['pType']>('primary')
const pSelected = ref<PDoubleTextProps['pSelected']>(false)
const pDisabled = ref<PDoubleTextProps['pDisabled']>(false)
const pBold = ref<PDoubleTextProps['pBold']>(false)

const pTypes = [
  'primary',
  'secondary',
]

const pIconColors: PDoubleTextProps['pIconColor'][] = [
  'persian-gradient',
  'orange',
  'persian',
  'cyan',
  'amethyste',
  'teal',
  'green',
  'fuschia',
  'gray',
  'white',
  'bordered-persian',
  'blue-pulse',
]

const pIconTypes: PDoubleTextProps['pIconType'][] = [
  'default',
  'small',
  'large',
  'xsmall',
  'xlarge',
]
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
