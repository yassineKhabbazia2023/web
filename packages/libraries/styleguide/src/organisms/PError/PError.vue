<template>
  <div
    class="
      p-error-page
      flex
      flex--direction-column
      flex--align-items-flex-start
      flex--justify-content-space-between
    "
  >
    <div />

    <div class="p-error-page__content">
      <div class="p-error-page__title">
        {{ pTitle }}
      </div>
      <div class="p-error-page__description margin-top--4">
        {{ pDescription }}
      </div>
      <div class="margin-top--4">
        <PSkewedButton
          v-if="pButtonText"
          :pContent="pButtonText"
          pType="secondary"
          @click="$emit('handle-click')"
        />
      </div>
    </div>

    <div class="p-error-page__footer">
      <div
        v-if="pHasFooter"
        class="
          p-error-page__footer-content
          flex
          flex--justify-content-space-between
          flex--align-items-center
        "
        data-testid="footer-content"
      >
        <div>
          {{ pErrorName }} - {{ pErrorText }}
        </div>
        <div class="text-center">
          <slot name="footer-middle-content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PErrorBlockProps } from './PErrorTypes'
import PSkewedButton from '../../atoms/PSkewedButton/PSkewedButton.vue'

withDefaults(defineProps<PErrorBlockProps>(), {
  pHasFooter: true,
})

defineEmits<{
  'handle-click': [void]
}>()
</script>

<style lang="scss" scoped>
@use '@styleguide/assets/scss/pegase/_breakpoints';

.p-error-page {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 1.6rem 0 3.2rem;
  color: var(--el-color-base-white);
  background: var(--el-color-base-blue-pulse);
  background-image: url('../../assets/images/photos/worker-with-brand-shape.webp');
  background-repeat: no-repeat;
  background-position: bottom right;
  background-size: auto 100%;
  padding-left: 120px;

  @include breakpoints.media(md) {
      background-size: 45% auto;
      padding-left: 28px;
  }

  @include breakpoints.media(xs) {
      background-size: 40% auto;
      padding-left: 56px;
  }

  @include breakpoints.media(xxs) {
    min-width: 256px;
    background-size: 40% auto;
    padding-left: 32px;
    overflow-x: auto;
  }

  &__content, &__footer {
    width: 70%;
    @include breakpoints.media(xxs) {
      width: 75%;
    }
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
    width: 45%;

    @include breakpoints.media(md) {
      width: 75%;
    }
    @include breakpoints.media(xs) {
      font-size: 1.6rem;
    }
    @include breakpoints.media(xs) {
      font-size: 1.2rem;
    }
  }

  &__footer-content {
    width: 70%;
    font-size: 1.4rem;
    @include breakpoints.media(md) {
      width: 75%;
    }
    @include breakpoints.media(xs) {
      font-size: 1.6rem;
    }
    @include breakpoints.media(xs) {
      width: 95%;
      font-size: 1.2rem;
    }
  }
}
</style>
