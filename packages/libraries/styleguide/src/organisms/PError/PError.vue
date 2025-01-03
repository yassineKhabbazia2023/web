<template>
  <div
    class="p-error flex flex--align-items-stretch"
    :class="{ 'p-error--full-size': pIsFullSize }"
  >
    <div class="flex--basis-11 flex--shrink-1" />
    <div class="flex flex--grow-1">
      <div
        class="
          p-error__body
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
          <p class="p-error__title">
            {{ pTitle }}
          </p>
          <p class="p-error__description margin-top--2">
            {{ pDescription }}
          </p>
          <div class="margin-top--10">
            <PSkewedButton
              v-if="pButtonText"
              :pContent="pButtonText"
              pType="secondary"
              @click="$emit('handle-click')"
            />
          </div>
        </div>
        <div
          v-if="pHasFooter"
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
          <div v-if="errorText">
            {{ errorText }}
          </div>
          <div
            class="
              flex
              flex--grow-1
              flex--direction-column
              flex--align-items-center
              flex--justify-content-center
            "
          >
            <slot name="footer-middle-content" />
          </div>
        </div>
      </div>
    </div>
    <PImage
      :pName="pIllustrationName"
      class="
        p-error__image
        hidden-sm-and-down
        flex--shrink-1
      "
      pFit="contain"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PErrorBlockProps } from './PErrorTypes'
import PSkewedButton from '../../atoms/PSkewedButton/PSkewedButton.vue'
import PImage from '../../atoms/PImage/PImage.vue'
import { getErrorText } from './PErrorHelper'

const props = withDefaults(defineProps<PErrorBlockProps>(), {
  pHasFooter: true,
  pIsFullSize: true,
})

defineEmits<{
  'handle-click': [void]
}>()

const errorText = computed(() => getErrorText(props.pErrorName, props.pErrorText))
</script>

<style lang="scss" scoped>
@use '../../assets/scss/pegase/_breakpoints';

.p-error {
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

  &__description {
    font-size: 1.8rem;
    font-weight: 500;
    max-width: 60%;

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

  &:not(.p-error--full-size) {
    #{$self}__image {
      @include breakpoints.media(md2) {
        flex-basis: 72%;
      }
    }
  }
}
</style>
