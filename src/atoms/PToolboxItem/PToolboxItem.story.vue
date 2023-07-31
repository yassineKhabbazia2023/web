<template>
  <Story title="2. Atoms/ToolboxItem" icon="radix-icons:divider-horizontal">
    <Variant title="Default">
      <PToolboxItem
        :value="defaultState.value"
        :hasIcon="defaultState.hasIcon"
        :disabled="defaultState.disabled"
      >
        <template #icon>
          <PIcon size="16">
            <PITrash />
          </PIcon>
        </template>
      </PToolboxItem>

      <template #controls>
        <HstText v-model="defaultState.value" title="value" />
        <HstCheckbox v-model="defaultState.hasIcon" title="hasIcon" />
        <HstCheckbox v-model="defaultState.disabled" title="disabled" />
      </template>
    </Variant>

    <Variant title="Without icon ">
      <PToolboxItem
        :value="WithoutIconState.value"
        :hasIcon="WithoutIconState.hasIcon"
        :disabled="WithoutIconState.disabled"
      >
        <template #icon>
          x
        </template>
      </PToolboxItem>
      <template #controls>
        <HstText v-model="WithoutIconState.value" title="value" />
        <HstCheckbox v-model="WithoutIconState.disabled" title="disabled" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import PToolboxItem from '@/atoms/PToolboxItem'
import PIcon from '@/atoms/PIcon'

const defaultState = reactive({
  hasIcon: true,
  value: 'Supprimer',
  disabled: false
})

const WithoutIconState = reactive({
  hasIcon: false,
  value: 'Hello world',
  disabled: false
})
</script>
<docs lang="md">
  <div>
    PToolboxItem is used to construct each line of the PToolbox element.
    It can contains an icon or not.
  </div>

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1277%253A6366%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
