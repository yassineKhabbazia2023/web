<template>
  <div
    :class="[
      'p-stat-card',
      pBackgroundClass,
      'padding--4',
      'text-center',
    ]"
  >
    <div
      class="
        p-stat-card__header
        flex
        flex--justify-content-center
        flex--align-items-center
        flex-gap--1
      "
    >
      <PIcon
        v-if="pIcon !== undefined"
        :class="pAccentClass"
        :pName="pIcon"
        pSize="medium"
      />
      <span
        :class="[
          'font-size--16',
          'font-bold',
          'text-uppercase',
          pAccentClass,
        ]"
      >
        {{ pTitle }}
      </span>
    </div>
    <div
      class="
        p-stat-card__value
        font-bold
        text-color--black-rock-900
        margin-y--4
      "
    >
      {{ pValue }}
    </div>
    <div
      v-if="pDescription !== undefined"
      class="font-size--18 text-color--text-neutral"
    >
      {{ pDescription }}
    </div>
  </div>
</template>

<script setup lang="ts">
import PIcon from '../PIcon'
import type { PStatCardProps } from './PStatCardTypes'

withDefaults(defineProps<PStatCardProps>(), {
  pBackgroundClass: 'bg--surface-information-primary',
  pAccentClass: 'text-color--text-information-primary',
})
</script>

<style scoped lang="scss">
.p-stat-card {
  min-width: 180px;

  &__value {
    font-size: 48px;
    line-height: 1;
  }
}
</style>
