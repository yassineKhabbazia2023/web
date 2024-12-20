<template>
  <Story
    title="2. Atoms/User Card"
    icon="mdi:page-layout-header"
    :layout="{ type: 'grid', width: '100%' }"
  >
    <Variant title="User Card with Image and all choices">
      <PUserCard
        pImageName="user-female"
        :pTitle="data.pTitle"
        :pTag="data.pTag"
        :pSubtitle="data.pSubtitle"
        :pDescription="data.pDescription"
      >
        <PButton
          pType="default"
          pSize="small"
        >
          <PIcon class="el-button__icon--left" pName="vectorPen" />
          Designate a signatory
        </PButton>
      </PUserCard>
    </Variant>
    <Variant title="User Card Gray with Image and all choices">
      <PUserCard
        pImageName="user-female"
        :pTitle="data.pTitle"
        :pTag="data.pTag"
        :pSubtitle="data.pSubtitle"
        :pDescription="data.pDescription"
        pColor="gray"
      >
        <PButton
          pType="default"
          pSize="small"
        >
          <PIcon class="el-button__icon--left" pName="vectorPen" />
          Designate a signatory
        </PButton>
      </PUserCard>
    </Variant>
    <Variant title="User Card with Avatar and no description">
      <PUserCard
        pAvatarContent="AB"
        :pTitle="data.pTitle"
        :pTag="data.pTag"
        :pSubtitle="data.pSubtitle"
      >
        <PButton
          pType="primary"
          pSize="small"
        >
          <PIcon class="el-button__icon--left" pName="add" />
          Call to action
        </PButton>
      </PUserCard>
    </Variant>
    <Variant title="User Card with tag right">
      <PUserCard
        pImageName="user-male"
        :pTitle="data.pTitle"
        :pTag="data.pTag"
        :pSubtitle="data.pSubtitle"
      >
        <PTag
          pColor="persian"
          pSize="default"
          pIconLeft="PIPerson"
          pContent="Client"
          pEffect="light"
        />
      </PUserCard>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import PButton from '../../atoms/PButton'
import PIcon from '../../atoms/PIcon'
import PTag from '../../atoms/PTag'
import PUserCard from './'
import type { PUserCardProps } from './PUserCardTypes'

const data: PUserCardProps = {
  pTitle: 'Name Last Name',
  pSubtitle: 'name.lastname@gmail.com',
  pDescription: 'Description of user',
  pImageName: 'activation',
  pTag: {
    pSize: 'default',
    pColor: 'gray-900',
    pContent: 'Entity',
    pIconLeftName: 'building',
    pEffect: 'light',
  },
}
</script>

<docs lang="md">
  ## User Card
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D7220%253A14717%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
