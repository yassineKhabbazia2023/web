<template>
  <section
    :id="pStepId !== undefined ? `step-${pStepId}` : undefined"
    class="
      conformity-step-card
      bg--surface-basic-primary
      flex
      flex--direction-column
      padding--6
      shadow--6-bottom
    "
  >
    <h2
      v-if="pHideTitle !== true"
      class="
        conformity-step-card__title
        flex
        flex--align-items-center
        font-size--16
        font-semibold
        margin--0
        margin-bottom--1
      "
    >
      <PIcon
        pName="pulse"
        :pColor="AppColors.JUNGLE_400"
        pSize="16"
      />
      <span class="margin-left--1">{{ pTitle }}</span>
    </h2>
    <slot />
  </section>
</template>

<script setup lang="ts">
import { AppColors } from '@pulse/styleguide'
import { PIcon } from '@pulse/styleguide/components'
import type { ConformityStepCardProps } from './conformity-step-card.types'

defineProps<ConformityStepCardProps>()
</script>
