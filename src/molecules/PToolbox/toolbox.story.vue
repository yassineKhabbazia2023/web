<template>
  <Story title="Molecules/Toolbox" icon="radix-icons:dropdown-menu">
    <Variant title="Custum tooltip">
      <PToolbox :elements="toolboxBasicData">
        <PButton> Hover button </PButton>
      </PToolbox>
    </Variant>
  </Story>
</template>

<docs lang="md">
  ## PToolbox
  This component is used for toolboxes.
  It is constructed thanks to the PToolboxItem component.
</docs>

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
