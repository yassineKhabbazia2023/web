<template>
  <Story title="3. Molecules/Toolbox" icon="radix-icons:dropdown-menu">
    <Variant title="Custum tooltip">
      <PToolbox :elements="toolboxBasicData">
        <PButton> Hover button </PButton>
      </PToolbox>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PToolbox from '@/molecules/PToolbox'
import PButton from '@/atoms/PButton'
import { ref } from 'vue'

const toolboxBasicData = ref([
  {
    iconName: 'PITrash',
    value: 'Delete',
    actionName: 'delete'
  },
  {
    iconName: 'PIAdd',
    value: 'Add',
    actionName: 'add'

  },
  {
    iconName: 'PIVectorPen',
    value: 'Rename',
    actionName: 'rename'
  },
  {
    iconName: 'PISend',
    value: 'Transmit',
    actionName: 'transmit'

  }
])
</script>

<docs lang="md">
  ## PToolbox
  This component is used for toolboxes.
  It is constructed thanks to the PToolboxItem component.
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1277%253A6366%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
