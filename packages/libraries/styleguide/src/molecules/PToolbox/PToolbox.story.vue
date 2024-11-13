<template>
  <Story title="3. Molecules/Toolbox" icon="radix-icons:dropdown-menu">
    <Variant title="Custum tooltip">
      <PToolbox :pElements="toolboxBasicData">
        <PButton> Hover button </PButton>
      </PToolbox>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PButton from '../../atoms/PButton'
import PToolbox from '.'
import type { PToolboxItemProps } from '../../atoms/PToolboxItem/PToolboxItemTypes'

const toolboxBasicData: PToolboxItemProps[] = [
  {
    pIconName: 'PITrash',
    pValue: 'Delete',
    pActionName: 'delete',
    pState: 'default',
    pContentTooltip: 'Test tooltip',
  },
  {
    pIconName: 'PIAdd',
    pValue: 'Add',
    pActionName: 'add',
    pState: 'default',
  },
  {
    pIconName: 'PIVectorPen',
    pValue: 'Rename',
    pActionName: 'rename',
    pState: 'default',
  },
  {
    pIconName: 'PISend',
    pValue: 'Transmit',
    pActionName: 'transmit',
    pState: 'danger',
  },
]
</script>

<docs lang="md">
  ## PToolbox
  This component is used for toolboxes.
  It is constructed thanks to the PToolboxItem component.
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1277%253A6366%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
