<template>
  <div class="p-radio-card">
    <PRadio
      :pLabel="pLabel"
      class="
        p-radio-card__content
        padding--4
        radius--1
        flex
      "
    >
      <div
        class="
          flex
          flex--justify-content-space-between
          flex--align-items-center
        "
      >
        <div>
          <p class="h4">
            {{ pTitle }}
          </p>
          <p
            v-if="pDescription"
            class="
              p-radio-card__description
              font-normal
              margin-top--1
            "
          >
            {{ pDescription }}
          </p>
        </div>
        <div class="p-radio-card__cta">
          <slot />
        </div>
      </div>
    </PRadio>
  </div>
</template>

<script setup lang="ts">
import PRadio from '../../atoms/PRadio'
import type { PRadioCardProps } from './PRadioCardTypes'

defineProps<PRadioCardProps>()
</script>

<style lang="scss">
.p-radio-card {
  .el-radio__label {
    width: 100%;
    padding-left: 12px;

    .p-radio-card__cta {
      .p-button--white {
        background: inherit;
        border: inherit;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.p-radio-card {
  &:not(:last-child) {
    margin-bottom: 16px;
  }

  &__content {
    width: 100%;
    height: inherit;
    white-space: inherit;
    border: 1px solid var(--el-border-color);

    &:hover,
    &.is-checked {
      border-color: var(--el-color-primary);
    }

    &.is-checked {
      background: var(--el-color-persian-50);
    }
  }

  &__description {
    color: var(--el-color-neutral-gray-700);
    font-size: 1.4rem;
  }
}
</style>

