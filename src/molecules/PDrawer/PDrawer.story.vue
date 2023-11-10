<template>
  <Story
    title="3. Molecules/Drawer"
    :layout="{
      type: 'single',
      iframe: true
    }"
  >
    <div class="container">
      <Variant title="Drawer">
        <PButton
          pPlain
          @click="pDrawerControl.openDrawer = !pDrawerControl.openDrawer"
        >
          Open /close
        </PButton>
        <PDrawer
          v-model="pDrawerControl.openDrawer"
          :pTitle="pDrawerControl.title"
          :pShowPreviousStep="pDrawerControl.showPreviousStep"
          :pSize="pDrawerControl.size"
          :pDirection="pDrawerControl.direction"
        />
        <template #controls>
          <HstText v-model="pDrawerControl.title" title="Title" />
          <HstRadio
            v-model="pDrawerControl.size"
            title="Size"
            :options="radioSizeOptions"
          />
          <HstRadio
            v-model="pDrawerControl.direction"
            title="Open direction"
            :options="radioDirectionOptions"
          />
          <HstCheckbox
            v-model="pDrawerControl.showPreviousStep"
            title="Show previous button"
          />
          <HstCheckbox
            v-model="pDrawerControl.openDrawer"
            title="Drawer visibility"
          />
        </template>
      </Variant>
    </div>
  </Story>
</template>

<script setup lang="ts">
import PDrawer from '.'
import PButton from '@/atoms/PButton'
import { reactive } from 'vue'
import type { PDrawerProps } from './PDrawerTypes'
const pDrawerControl: {
  title: string
  direction: PDrawerProps['pDirection']
  showPreviousStep: boolean
  openDrawer: boolean
  size: number | string
} = reactive({
  title: 'Title',
  direction: 'rtl',
  showPreviousStep: false,
  size: '33%',
  openDrawer: false
})

const radioDirectionOptions: { label: string; value: string }[] = [
  {
    label: 'rtl',
    value: 'rtl'
  },
  {
    label: 'ltr',
    value: 'ltr'
  }
]

const radioSizeOptions: { label: string; value: string }[] = [
  {
    label: '33%',
    value: '33%'
  },
  {
    label: '50%',
    value: '50%'
  }
]
</script>

<docs lang="md">
  ## Drawer
  This component is used for drawer.

| Name                      | Description                                       | Type                         | Accepted Values                                    | Default           |
| ------------------------- | ------------------------------------------------- |------------------------------|----------------------------------------------------|-------------------|
| pTitle                    | Drawer title                                      | `String`                     |                                                    |                   |
| pDirection                | Define the drawer direction opening               | `String`                     | `rtl` or `ltr`                                     | `rtl`             |
| showPreviousStep          | Hide or show the previous step button             | `Boolean`                    | `true` or `false`                                  | `false`           |
| pSize                     | The width of drawer when opened                   | `String`                     | `33%` or `50%`                                     | `33%`             |
| pShowClose                | The el drawer close button visibility             | `String`                     | `33%` or `50%`                                     | `33%`             |

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1703%253A12592%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
