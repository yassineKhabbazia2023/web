<template>
  <Story title="Atoms/ToolboxItem" icon="radix-icons:divider-horizontal">
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

<!-- eslint-disable max-len -->
<docs lang="md">
  <div>
    PToolboxItem is used to construct each line of the PToolbox element.
    It can contains an icon or not.
    <iframe
    class="responsive-iframe"
    src="https://www.figma.com/file/hycpUsOrc1fFD7xcYY0ryN/%F0%9F%A6%84-Librairie-de-composants?node-id=1341%3A7359&mode=dev"></iframe>
  </div>
</docs>
<!-- eslint-enable max-len -->

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
