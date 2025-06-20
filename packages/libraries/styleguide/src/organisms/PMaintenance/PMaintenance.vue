<template>
  <div
    class="
      p-maintenance
      flex
      flex--align-items-stretch
    "
  >
    <div class="flex--basis-11 flex--shrink-1" />
    <div class="flex flex--grow-1">
      <div
        class="
          p-maintenance__body
          flex
          flex--direction-column
          flex--justify-content-space-between
        "
      >
        <div
          class="
            flex--grow-1
            flex
            flex--direction-column
            flex--justify-content-center
          "
        >
          <div
            class="p-maintenance__title"
          >
            <slot name="title" />
          </div>
          <div
            class="p-maintenance__subtitle margin-top--2"
          >
            <slot name="subtitle" />
          </div>
        </div>
        <div
          data-testid="footer-content"
          class="
            padding-y--4
            flex--grow-0
            flex
            flex-gap--1
            flex--align-items-stretch
            flex--align-items-center
          "
        >
          <div
            class="
              flex
              flex--grow-1
              flex--direction-column
              flex--align-items-center
              flex--justify-content-center
            "
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
    <PImage
      v-if="pIllustrationName !== undefined"
      :pName="pIllustrationName"
      class="
        p-maintenance__image
        hidden-sm-and-down
        flex--shrink-1
      "
      pFit="contain"
    />
  </div>
</template>

<script lang="ts" setup>
import PImage from '../../atoms/PImage/PImage.vue'
import type { PMaintenanceProps } from './PMaintenance.types'

defineProps<PMaintenanceProps>()
</script>

<style lang="scss" scoped>
@use '../../assets/scss/pegase/_breakpoints';

.p-maintenance {
  $self: &;

  height: 100%;
  color: var(--el-color-base-white);
  background: var(--el-color-base-blue-pulse);

  &__body {
    width: 100%;
  }

  &__title {
    font-size: 4.6rem;
    @include breakpoints.media(xs) {
      font-size: 4.0rem;
    }
    @include breakpoints.media(xxs) {
      font-size: 3.2rem;
    }
  }

  &__subtitle {
    font-size: 1.8rem;
    font-weight: 500;

    @include breakpoints.media(md2) {
      max-width: 100%;
    }
    @include breakpoints.media(sm) {
      max-width: 80%;
    }
  }

  &__image {
    :deep(.el-image__inner) {
      object-position: right bottom;
    }

    flex-basis: 38%;

    @include breakpoints.media(lg) {
      flex-basis: 72%;
    }

    @include breakpoints.media(md2) {
      flex-basis: 36%;
    }

    @include breakpoints.media(md) {
      flex-basis: 56%;
    }

    @include breakpoints.media(xxs) {
      font-size: 3.2rem;
    }
  }

  &:not(.p-maintenance--full-size) {
    #{$self}__image {
      @include breakpoints.media(md2) {
        flex-basis: 72%;
      }
    }
  }
}
</style>
