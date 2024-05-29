<template>
  <Story
    title="3. Molecules/FilterGroup"
    icon="radix-icons:divider-horizontal"
    :layout="{ type: 'single', iframe: true }"
  >
    <Variant title="Default">
      <div class="padding--4">
        <PFilterGroup
          v-model="pSelectedCodes"
          :pFilters="pFilters"
          @update:model-value="logEvent('update:model-value', $event)"
        />
      </div>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { logEvent } from 'histoire/client'
import PFilterGroup from '.'
import type { PFilterOption } from '@/molecules/PFilterGroup/PFilterGroupTypes'

const pSelectedCodes = ref<string[]>([])
const pFilters: PFilterOption[] = [
  {
    pIcon: 'PICheck',
    pValue: '2',
    pContent: 'Incident',
    pColor: 'danger',
    pCode: 'incident',
  },
  {
    pIcon: 'PICheck',
    pValue: '4',
    pContent: 'Deploiment',
    pColor: 'warning',
    pCode: 'deploiment',
  },
  {
    pIcon: 'PICheck',
    pContent: 'Actif',
    pColor: 'success',
    pCode: 'actif',
  },
  {
    pIcon: 'PICheck',
    pValue: 2,
    pContent: 'En cours',
    pColor: 'amethyste',
    pCode: 'en-cours',
  },
  {
    pIcon: 'PIXCircle',
    pValue: '9',
    pContent: 'Résilié',
    pColor: 'gray-900',
    pCode: 'resilie',
  },
]
</script>

<docs lang="md">
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe"
      src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D9952%253A1324%26mode%3Ddev">
    </iframe>
  </div>
</docs>
