<template>
  <button
    class="
      p-offer-card
      padding-top--2
      padding-right--4
      padding-bottom--2
      padding-left--4
    "
    :disabled="disabled"
    type="button"
    :class="{'p-offer-card--selected': pSelected}"
    @click="$emit('selectOfferEvent')"
  >
    <div class="p-offer-card__logo margin-right--4">
      <PImage
        pType="logos"
        :pName="pLogo"
        pFit="fill"
      />
    </div>
    <div class="p-offer-card__body">
      <h4 class="p-offer-card__title margin-bottom--1">
        {{ pTitle }}
      </h4>
      <p class="p-offer-card__description">
        {{ pDescription }}
      </p>
    </div>
    <div v-if="!disabled" class="p-offer-card__chevron">
      <PIcon
        class="p-offer-card__chevron-icon"
        :color="AppColors.GRAY_900"
        size="16px"
        pName="chevronRight"
      />
    </div>
  </button>
</template>

<script setup lang="ts">
import PImage from '../../atoms/PImage'
import PIcon from '../../atoms/PIcon'
import type { POfferCardProps } from './POfferCardTypes'
import { AppColors } from '../../utils/AppColorsEnum'

defineProps<POfferCardProps>()
defineEmits<{
  selectOfferEvent: []
}>()
</script>

<style lang="scss" scoped>
.p-offer-card {
  $self: &;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  border: none;
  appearance: none;
  background: none;
  text-align: left;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;

  &:disabled {
    pointer-events: none;
    background: var(--p-gray-50);

    #{$self}__title {
      color: var(--p-surface-neutral-default)
    }
    #{$self}__description {
      color: var(--p-gray-300)
    }
  }

  &:hover,
  &:focus {
    background-color: var(--p-surface-state-hover);
  }

  &:active {
    #{$self}__title {
      color: var(--p-jungle-700);
    }
    #{$self}__chevron-icon {
      color: var(--p-jungle-800);
    }
  }

  &--selected,
  &--selected:disabled {
    background-color: var(--p-surface-state-selection);
    border-color: var(--p-stroke-active);
  }

  &__logo {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  }

  &__body {
    width: 100%;
    overflow: hidden;
  }

  &__title {
    font-size: 1.6rem;
    font-weight: 700;
    line-height: 25px;
    color: var(--p-gray-900);
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: all 0.3s ease;
  }

  &__description {
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 17px;
    color: var(--p-gray-700);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__chevron {
    align-items: center;
    display: flex;
    flex-shrink: 0;
    flex-grow: 0;
    transition: all 0.3s ease;
  }
}
</style>
