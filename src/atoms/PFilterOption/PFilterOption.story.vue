<template>
  <Story title="2. Atoms/FilterOption" icon="radix-icons:divider-horizontal">
    <Variant title="Default">
      <div class="padding--4">
        <PFilterOption
          :pSelected="props.pSelected"
          :pDisabled="props.pDisabled"
          :pContent="props.pContent"
          :pColor="props.pColor"
          :pIcon="props.pIcon"
          :pNumber="props.pNumber"
          @update:p-selected="props.pSelected = !props.pSelected"
        />
      </div>
      <template #controls>
        <HstCheckbox v-model="props.pDisabled" title="disabled" />
        <HstCheckbox v-model="props.pSelected" title="selected" />
        <HstRadio
          v-model="props.pColor"
          title="Filter Option Colors"
          :options="filterOptionColor"
        />
      </template>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { PIArrowUpCircle } from '@/atoms/PIcon/components'
import PFilterOption from '.'
import type { PFilterOptionProps } from './PFilterOptionTypes'

const props: PFilterOptionProps = reactive({
  pSelected: false,
  pDisabled: false,
  pContent: 'A déployer',
  pIcon: PIArrowUpCircle,
  pNumber: 3,
  pColor: 'warning'
})

const filterOptionColor: { label: string; value: PFilterOptionProps['pColor'] }[] = [
  {
    label: 'amethyste',
    value: 'amethyste'
  },
  {
    label: 'success',
    value: 'success'
  },
  {
    label: 'warning',
    value: 'warning'
  },
  {
    label: 'danger',
    value: 'danger'
  }
]
</script>

<docs lang="md">
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe"
      src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D9952%253A1324%26mode%3Ddev">
    </iframe>
  </div>
</docs>
