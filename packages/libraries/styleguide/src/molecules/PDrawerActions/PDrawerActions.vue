<template>
  <div class="p-drawer-actions">
    <div class="p-drawer-actions__left">
      <PButton
        v-if="pBackCTA"
        pType="tertiary"
        :data-testid="pBackCTA.pTestId ?? 'backButton'"
        :pDisabled="pBackCTA.pDisabled"
        :pLoading="pBackCTA.pLoading"
        @click="emit('click-back-cta')"
      >
        {{ pBackCTA.pLabel }}
      </PButton>
    </div>
    <div class="p-drawer-actions__right">
      <PButton
        v-if="pSecondaryCTA"
        pType="secondary"
        :data-testid="pSecondaryCTA.pTestId ?? 'secondaryButton'"
        :pDisabled="pSecondaryCTA.pDisabled"
        :pLoading="pSecondaryCTA.pLoading"
        @click="emit('click-secondary-cta')"
      >
        {{ pSecondaryCTA.pLabel }}
      </PButton>
      <PButton
        v-if="pPrimaryCTA"
        pType="primary"
        :data-testid="pPrimaryCTA.pTestId ?? 'primaryButton'"
        :pDisabled="pPrimaryCTA.pDisabled"
        :pLoading="pPrimaryCTA.pLoading"
        @click="emit('click-primary-cta')"
      >
        {{ pPrimaryCTA.pLabel }}
      </PButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PDrawerActionsProps } from './PDrawerActionsTypes'

import PButton from '../../atoms/PButton'

defineProps<PDrawerActionsProps>()

const emit = defineEmits<{
  'click-back-cta': []
  'click-secondary-cta': []
  'click-primary-cta': []
}>()
</script>

<style scoped lang="scss">
.p-drawer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  &__right {
    display: flex;
    gap: 0.8rem;
    margin-left: auto;
  }
}
</style>
