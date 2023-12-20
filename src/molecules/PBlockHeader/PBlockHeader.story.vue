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
        <PButton
          pType="primary"
          pSize="small"
        >
          Activate
          <PIcon class="el-button__icon--right">
            <PIArrowRight />
          </PIcon>
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
        <PButton
          pType="default"
          pSize="small"
        >
          <PIcon class="el-button__icon--left">
            <PIPencilSquare />
          </PIcon>
          Note
        </PButton>
      </PBlockHeader>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import PButton from '@/atoms/PButton'
import PBlockHeader from './'
import type { PBlockHeaderProps } from './PBlockHeaderTypes'

const data: PBlockHeaderProps = {
  pTitle: 'Add collaborators',
  pDescription: 'You can add collaborators on this offer.',
  pSize: 'default',
  pColor: 'persian',
  pHasButton: false,
  pImage: {
    pFit: 'fill',
    pType: 'paupulse',
    pName: 'add-user'
  }
}
</script>

<docs lang="md">
  ## Block Header
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D7213%253A14294%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
