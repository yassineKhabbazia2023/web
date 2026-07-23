<template>
  <div :data-testid="pTestId">
    <div
      v-if="pHasHeader"
      class="flex cursor-pointer flex--align-items-center"
      :class="pHeaderCssClass"
      data-testid="accordion-header"
      @click="onClickHeader"
    >
      <slot name="header" />
      <PIcon
        :size="24"
        :pName="iconName"
        class="margin--4"
      />
    </div>
    <div
      v-if="pIsOpen"
      class="body"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import PIcon from '../PIcon'
import type { PAccordionProps } from './PAccordion.types'

const props = withDefaults(defineProps<PAccordionProps>(), {
  pHasHeader: true,
})

const emit = defineEmits<{
  'open': []
  'close': []
}>()

function onClickHeader() {
  if (props.pIsOpen) {
    emit('close')
  } else {
    emit('open')
  }
}

const iconName = computed(() => props.pIsOpen ? 'chevronUp' : 'chevronDown')
</script>
