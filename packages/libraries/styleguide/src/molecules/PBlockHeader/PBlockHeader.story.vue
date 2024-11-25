<template>
  <Story
    title="3. Molecules/Block Header"
    icon="mdi:page-layout-header"
    :layout="{ type: 'grid', width: '100%' }"
  >
    <Variant title="Block header gray">
      <PBlockHeader
        :pTitle="data.pTitle"
        :pDescription="data.pDescription"
        pColor="gray"
        :pSize="data.pSize"
        :pImage="data.pImage"
        :pHasButton="false"
      />
    </Variant>
    <Variant title="Block header persian">
      <PBlockHeader
        :pTitle="data.pTitle"
        :pDescription="data.pDescription"
        :pColor="data.pColor"
        :pSize="data.pSize"
        :pImage="data.pImage"
        pHasButton
      >
        <PButton pType="primary" pSize="small">
          Activate
          <PIcon class="el-button__icon--right" pName="arrowRight" />
        </PButton>
      </PBlockHeader>
    </Variant>
    <Variant title="Block header big">
      <PBlockHeader
        :pTitle="data.pTitle"
        :pDescription="data.pDescription"
        :pColor="data.pColor"
        pSize="big"
        :pImage="data.pImage"
        pHasButton
      >
        <PButton pType="default" pSize="small">
          <PIcon class="el-button__icon--left" pName="pencilSquare" />
          Note
        </PButton>
      </PBlockHeader>
    </Variant>
    <Variant title="Block header with suffix">
      <PBlockHeader
        :pTitle="data.pTitle"
        :pDescription="data.pDescription"
        :pColor="data.pColor"
        pSize="big"
        :pImage="data.pImage"
        pHasButton
      >
        <template #suffix>
          <p class="margin-bottom--2 font-small font-semibold">
            Veuillez rechercher un collaborateur :
          </p>
          <PAutocomplete
            v-model="selectedCollaborator"
            pPlaceholder="Sélectionner un ou plusieurs collaborateurs"
            :pFetchSuggestions="() => collaboratorsTestData"
            pClearable
          >
            <template #prefix>
              <PIcon pName="search" />
            </template>
          </PAutocomplete>
        </template>
      </PBlockHeader>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import PButton from '../../atoms/PButton'
import PAutocomplete from '../../molecules/PAutocomplete'
import type { PBlockHeaderProps } from './PBlockHeaderTypes'
import PBlockHeader from './'
import PIcon from '../../atoms/PIcon'

const selectedCollaborator = ref(null)
const collaboratorsTestData = [
  { value: 'Mickaël BELLANGER - toto@kpmg.fr - (ESC, Bureau Y)', link: 'Collab1' },
  { value: 'Clémentine MICKELLE - toto@kpmg.fr - (ESC, Bureau Y)', link: 'Collab2' },
  { value: 'Mickey Oussama - toto@kpmg.fr - (ESC, Bureau Y)', link: 'Collab13' },
]
const data: PBlockHeaderProps = {
  pTitle: 'Add collaborators',
  pDescription: 'You can add collaborators on this offer.',
  pSize: 'default',
  pColor: 'persian',
  pHasButton: false,
  pImage: {
    pFit: 'fill',
    pName: 'add-user',
  },
}
</script>

<docs lang="md">
## Block Header

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D7213%253A14294%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
