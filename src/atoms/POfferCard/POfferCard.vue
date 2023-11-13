<template>
  <button
    class="p-offer-card padding-x--4 padding-y--2 radius--2"
    @click="$emit('selectOfferEvent')"
  >
    <div class="p-offer-card__logo margin-right--4">
      <PImage
        type="logos"
        :name="pLogo"
        fit="fill"
      />
    </div>
    <div class="p-offer-card__body">
      <h4 class="p-offer-card__title margin-bottom--2">
        {{ pTitle }}
      </h4>
      <p class="p-offer-card__description">
        {{ pDescription }}
      </p>
    </div>
    <div class="p-offer-card__chevron">
      <PIcon
        color="#5546FF"
        size="16px"
      >
        <PIChevronRight />
      </PIcon>
    </div>
  </button>
</template>

<script setup lang="ts">
import PImage from '@/atoms/PImage'
import PIcon from '@/atoms/PIcon'
import type { POfferCardProps } from './POfferCardTypes'

defineProps<POfferCardProps>()
defineEmits(['selectOfferEvent'])
</script>

<style lang="scss" scoped>
.p-offer-card {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid var(--el-color-neutral-gray-100);
  appearance: none;
  background: none;
  text-align: left;
  cursor: pointer;

  $this: &;
  &:hover {
    border: 1px solid var(--el-color-secondary-amethyste);

    #{$this}__title {
      color: var(--el-color-secondary-amethyste);
    }
  }

  &__logo {
    width: 60px;
    display: flex;
    height: 35px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  }

  &__body {
    width: 100%;
    overflow: hidden;

    &:hover {
      color: var(--el-color-secondary-amethyste);
    }
  }

  &__title {
    font-size: 1.6rem;
    font-weight: 700;
    line-height: 25px;
    color: var(--el-color-neutral-gray-900);
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
      color: var(--el-color-secondary-amethyste);
    }
  }

  &__description {
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 17px;
    color: var(--el-color-neutral-gray-700);
  }

  &__chevron {
    align-items: center;
    display: flex;
    flex-shrink: 0;
    flex-grow: 0;
  }
}
</style>
