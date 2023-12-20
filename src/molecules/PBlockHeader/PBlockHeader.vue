<template>
  <div
    class="p-block-header"
    :class="pClassMapper"
  >
    <PImage
      class="p-block-header__image"
      :pType="pImage.pType"
      :pName="pImage.pName"
      :pFit="pImage.pFit"
    />
    <div class="p-block-header__content">
      <p class="p-block-header__title">
        {{ pTitle }}
      </p>
      <p class="p-block-header__description">
        {{ pDescription }}
      </p>
    </div>
    <div v-if="pHasButton" class="p-block-header__button">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import PImage from '@/atoms/PImage'
import type { PBlockHeaderProps } from './PBlockHeaderTypes'

const props = withDefaults(defineProps<PBlockHeaderProps>(), {
  pSize: 'default'
})

const pClassMapper = computed(() => ({
  [`p-block-header--color-${props.pColor}`]: true,
  [`p-block-header--size-${props.pSize}`]: true
}))
</script>

<style lang="scss" scoped>
.p-block-header {
  $self: &;

  display: flex;
  padding: 12px;
  border-radius: 4px 4px 0 0;

  &--color {
    &-persian {
      background: var(--el-color-persian-50);
    }

    &-gray {
      background: var(--el-color-neutral-gray-50);
    }
  }

  &--size {
    &-big {
      #{$self}__image {
        height: 95px;
      }

      #{$self}__title {
        font-size: 2.1rem;
      }

      #{$self}__description {
        font-size: 1.4rem;
      }
    }
  }

  &__image {
    flex-grow: 0;
    flex-shrink: 0;
    height: 54px;
    width: auto;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    margin: 0 24px 0 12px;
  }

  &__title {
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--el-color-neutral-gray-900)
  }

  &__description {
    font-size: 1.2rem;
    color: var(--el-color-neutral-gray-500);
  }

  &__button {
    flex-grow: 0;
    flex-shrink: 0;
  }
}
</style>
