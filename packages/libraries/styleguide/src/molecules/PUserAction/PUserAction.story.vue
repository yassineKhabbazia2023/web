<template>
  <Story
    title="3. Molecules/User action"
    icon="fluent:button-16-regular"
    :layout="{ type: 'grid', width: '90%' }"
  >
    <Variant
      v-for="({ title, data }, index) in variants"
      :key="index"
      :title="title"
      :source="source"
    >
      <PUserAction
        v-model:pInputValue="data.pInputValue"
        :pProfile="data.pProfile"
        :pTitle="data.pTitle"
        :pDescription="data.pDescription"
        :pRole="data.pRole"
        :pTagContent="data.pTagContent"
        :pShowInput="data.pShowInput"
        :pInputPlaceholder="data.pInputPlaceholder"
        :pShowDelete="data.pShowDelete"
        :pShowOptions="data.pShowOptions"
        :pOptions="data.pOptions"
        :pOptionsPlaceholder="data.pOptionsPlaceholder"
        :pOptionsValue="data.pOptionsValue"
        :pWarningContent="data.pWarningContent"
        @click-delete="logEvent('click-delete', $event)"
        @update:p-input-value="logEvent('update:pInputValue', $event)"
        @update:p-options-value="onUpdateOptionsValue"
      />
      <template #controls>
        <HstText v-model="data.pInputValue" title="Input value" />
        <HstText v-model="data.pProfile" title="Profile" />
        <HstText v-model="data.pTitle" title="Title" />
        <HstText v-model="data.pDescription" title="Content" />
        <HstText v-model="data.pRole" title="Role" />
        <HstText v-model="data.pTagContent" title="Tag content" />
        <HstCheckbox v-model="data.pShowInput" title="Show input" />
        <HstText v-model="data.pInputPlaceholder" title="pInputPlaceholder" />
        <HstText v-model="data.pOptionsPlaceholder" title="pOptionsPlaceholder" />
        <HstCheckbox v-model="data.pShowDelete" title="Show delete button" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PUserAction from '.'
import type { PUserActionProps, POptionsValue } from './PUserActionTypes'
import { reactive } from 'vue'
import { logEvent } from 'histoire/client'
import { getMockedOptions } from './PUserActionMocks'

const exampleOffer1 = reactive<PUserActionProps>({
  pProfile: 'SL',
  pTitle: 'Suliman Lescot',
  pDescription: 'suliman.lescot@test.fr',
  pTagContent: '',
  pRole: 'Consultant advisory',
  pShowInput: false,
  pInputValue: '',
  pInputPlaceholder: '',
  pShowDelete: true,
})

const exampleOffer2 = reactive<PUserActionProps>({
  pProfile: 'SL',
  pTitle: 'Suliman Lescot',
  pDescription: 'suliman.lescot@test.fr',
  pTagContent: 'By default',
  pRole: '',
  pShowInput: true,
  pInputValue: '',
  pInputPlaceholder: 'Entrez la fonction du collaborateur',
  pShowDelete: true,
})
const exampleOffer3 = reactive<PUserActionProps>({
  pProfile: 'SL',
  pTitle: 'Suliman Lescot',
  pDescription: 'suliman.lescot@test.fr',
  pTagContent: 'By default',
  pRole: '',
  pShowInput: true,
  pInputValue: '',
  pInputPlaceholder: 'Entrez la fonction du collaborateur',
  pShowDelete: false,
})

const exampleOffer4 = reactive<PUserActionProps>({
  pProfile: 'SL',
  pTitle: 'Suliman Lescot',
  pDescription: 'suliman.lescot@test.fr',
  pTagContent: '',
  pRole: '',
  pShowInput: false,
  pInputValue: '',
  pInputPlaceholder: 'Entrez la fonction du collaborateur',
  pShowDelete: true,
  pShowOptions: true,
  pOptions: getMockedOptions(),
  pOptionsPlaceholder: 'Rôle IBS',
  pOptionsValue: '',
})

const exampleOffer5 = reactive<PUserActionProps>({
  pProfile: 'SL',
  pTitle: 'Suliman Lescot',
  pDescription: 'suliman.lescot@test.fr',
  pTagContent: '',
  pRole: '',
  pWarningContent: 'Vous avez déjà délégué votre portefeuille à ce collaborateur.',
})

const variants = [{
  title: 'User action - Offer 1/5',
  data: exampleOffer1,
}, {
  title: 'User action - Offer 2/5',
  data: exampleOffer2,
}, {
  title: 'User action - Offer 3/5',
  data: exampleOffer3,
}, {
  title: 'User action - Offer 4/5',
  data: exampleOffer4,
}, {
  title: 'User action - Offer 5/5',
  data: exampleOffer5,
}]

const source = `
import { PUserAction } from '@pulse/styleguide'

<PUserAction
  :pProfile="exampleOffer1.pProfile"
  :pTitle="exampleOffer1.pTitle"
  :pDescription="exampleOffer1.pDescription"
  :pTagContent="exampleOffer1.pTagContent"
  :pRole="exampleOffer1.pRole"
  :pShowInput="exampleOffer1.pShowInput"
  v-model:pInputValue="exampleOffer1.pInputValue"
  :pShowDelete="exampleOffer1.pShowDelete"
  @click-delete="logEvent('click-delete', $event)"
  @update:pInputValue="logEvent('update:pInputValue', $event)"
/>
`

function onUpdateOptionsValue(value: POptionsValue) {
  exampleOffer4.pOptionsValue = value
  logEvent('update:pOptionsValue', value)
}
</script>

<docs lang="md">
  <div class="responsive-iframe-container">
  <iframe class="responsive-iframe" width="800" height="450"
    src="https://www.figma.com/file/hycpUsOrc1fFD7xcYY0ryN/%F0%9F%A6%84-Librairie-de-composants?type=design&node-id=9427-337&mode=design&t=zH7lDH6w43cttsDp-0">
  </iframe>
  </div>
</docs>
