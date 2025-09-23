<template>
  <Story
    title="3. Molecules/Entity Header"
    icon="mdi:page-layout-header"
    :layout="{ type: 'grid', width: '100%' }"
  >
    <Variant title="Entity header">
      <PEntityHeader
        :pLegalName="data.pLegalName"
        :pAccountNumber="data.pAccountNumber"
      />
    </Variant>
    <Variant title="Entity header small">
      <PEntityHeader
        :pLegalName="data.pLegalName"
        :pAccountNumber="data.pAccountNumber"
        pSize="small"
      />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import type { PEntityHeaderProps } from './PEntityHeader.types'
import PEntityHeader from './'

const data: PEntityHeaderProps = {
  pLegalName: 'Legal name',
  pAccountNumber: 'AC01092025',
}
</script>

<docs lang="md">
## Entity Header

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D7213%253A14294%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
