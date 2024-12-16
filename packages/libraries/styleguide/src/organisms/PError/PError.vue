<template>
  <div
    class="p-error flex flex--align-items-stretch"
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
          <div>
            {{ pErrorName }} - {{ pErrorText }}
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
        hidden-sm-and-down
        flex--shrink-1
        flex--basis-33
      "
      pFit="cover"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PErrorBlockProps } from './PErrorTypes'
import PSkewedButton from '../../atoms/PSkewedButton/PSkewedButton.vue'
import PImage from '../../atoms/PImage/PImage.vue'

withDefaults(defineProps<PErrorBlockProps>(), {
  pHasFooter: true,
})

defineEmits<{
  'handle-click': [void]
}>()
</script>

<style lang="scss" scoped>
@use '../../assets/scss/pegase/_breakpoints';

.p-error {
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
    max-width: 300px;
  }
}
</style>
