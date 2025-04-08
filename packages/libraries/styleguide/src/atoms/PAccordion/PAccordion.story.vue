<template>
  <Story
    title="2. Atoms/Accordion"
    :layout="{ type: 'grid', width: 400}"
  >
    <Variant title="Main alert">
      <PAccordion
        :pIsOpen="isOpen"
        :pHasHeader="hasHeader"
        @open="isOpen = true"
        @close="isOpen = false"
      >
        <template #header>
          <div class="flex--grow-1 ">
            Header
          </div>
        </template>
        Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Sed venenatis quis dolor in consequat. Integer nec viverra dui.
        Quisque eget risus feugiat, pellentesque sem interdum, vehicula eros.
      </PAccordion>
      <template #controls>
        <HstCheckbox v-model="isOpen" title="pIsOpen" />
        <HstCheckbox v-model="hasHeader" title="pHasHeader" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PAccordion from './'

const isOpen = ref(true)
const hasHeader = ref(true)
</script>
