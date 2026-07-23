<template>
  <div
    class="
      flex
      flex--align-items-center
      flex--justify-content-center
    "
  >
    <PButton
      :pLoading="pLoading"
      class="
        font-semibold
        hover-text-color--jungle-700
        text-color--jungle-400
      "
      pType="default"
      pSize="small"
      :data-testid="`${pTestId}-load-more-button`"
      @click="emit('load-more')"
    >
      <PIcon
        class="font-size--10"
        pName="caretDown"
      />
      <span>{{ pLabel }}</span>
      <PIcon
        class="font-size--10"
        pName="caretDown"
      />
    </PButton>
  </div>
</template>

<script setup lang="ts">
import PButton from '../PButton'
import PIcon from '../PIcon'
import type { PSamePagePaginationProps } from './PSamePagePaginationTypes'

withDefaults(defineProps<PSamePagePaginationProps>(), {
  pLoading: false,
  pTestId: 'psame-page-pagination',
})

const emit = defineEmits<{
  'load-more': []
}>()
</script>
