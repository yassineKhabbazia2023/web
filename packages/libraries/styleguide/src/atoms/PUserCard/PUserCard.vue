<template>
  <div class="p-user-card" :class="pClassMapper">
    <div class="p-user-card__left" data-ut="left-asset">
      <PImage
        v-if="pImageName"
        class="p-user-card__image"
        pType="portrait"
        :pName="pImageName"
      />
      <PAvatar
        v-if="pAvatarContent"
        pType="xlarge"
        pColor="fuschia"
      >
        {{ pAvatarContent }}
      </PAvatar>
    </div>
    <div class="p-user-card__content">
      <div class="p-user-card__header">
        <div class="p-user-card__header-left">
          <p
            v-if="pTitle"
            class="p-user-card__title"
          >
            {{ pTitle }}
          </p>
          <PTag
            v-if="!!pTag"
            :pSize="pTag.pSize"
            :pRound="pTag.pRound"
            :pDisableTransitions="pTag.pDisableTransitions"
            :pClosable="pTag.pClosable"
            :pContent="pTag.pContent"
            :pIconLeftName="pTag.pIconLeftName"
            :pIconRightName="pTag.pIconRightName"
            :pColor="pTag.pColor"
            data-ut="user-card-tag"
          />
        </div>
        <div
          v-if="!!slots['default']"
          class="p-user-card__header-right"
          data-ut="header-right"
        >
          <slot />
        </div>
      </div>
      <p v-if="pSubtitle" class="p-user-card__subtitle">
        {{ pSubtitle }}
      </p>
      <p v-if="pDescription && slots['description'] === undefined" class="p-user-card__description">
        {{ pDescription }}
      </p>
      <div
        v-if="slots['description'] !== undefined"
        class="margin-y--1"
        data-testid="user-card-description"
      >
        <slot name="description" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import PImage from '../../atoms/PImage'
import PAvatar from '../../atoms/PAvatar'
import PTag from '../../atoms/PTag'
import type { PUserCardProps } from './PUserCardTypes'

const props = withDefaults(defineProps<PUserCardProps>(), {
  pColor: 'default',
})

const pClassMapper = computed(() => ({
  [`p-user-card--color-${props.pColor}`]: true,
}))

const slots = useSlots()
</script>

<style lang="scss" scoped>
.p-user-card {
  $self: &;

  display: flex;
  align-items: center;
  padding: 20px;

  &--color {
    &-default {
      background: var(--p-surface-state-selection);
    }

    &-gray {
      background: var(--p-gray-50);
    }
  }

  &__left {
    margin-right: 12px;
    flex-grow: 0;
    flex-shrink: 0;
  }

  &__image {
    flex-grow: 0;
    flex-shrink: 0;
    height: 90px;
    padding: 32px;
    width: auto;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    overflow: hidden;
  }

  &__header {
    width: 100%;

    @media screen and (min-width: 768px) {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }
  }

  &__header-left {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  &__header-right {
    flex-grow: 0;
    flex-shrink: 0;
    margin-top: 4px;
    margin-bottom: 8px;

    @media screen and (min-width: 768px) {
      margin-top: 0;
      margin-left: 12px;
      margin-bottom: 0;
      text-align: right;
    }
  }

  &__title {
    margin-bottom: 4px;
    margin-right: 12px;
    font-size: 2.1rem;
    line-height: 1.2;
    font-weight: 600;
    color: var(--p-text-basic-heading);
  }

  &__subtitle {
    max-width: 100%;
    margin-top: 4px;
    font-size: 1.6rem;
    line-height: 1.2;
    color: var(--p-text-basic-body);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__description {
    margin-top: 4px;
    font-size: 1.2rem;
    line-height: 1.2;
    color: var(--p-text-basic-body);
  }
}
</style>
