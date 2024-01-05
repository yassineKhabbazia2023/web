<template>
  <div class="p-user-card">
    <div class="p-user-card__left" data-ut="left-asset">
      <PImage
        v-if="pAssetLeft === 'Image'"
        class="p-user-card__image"
        pType="portrait"
        :pName="pAssetContent"
      />
      <PAvatar
        v-if="pAssetLeft === 'Avatar'"
        pType="xlarge"
        pColor="bordered-persian"
      >
        {{ pAssetContent }}
      </PAvatar>
    </div>
    <div class="p-user-card__content">
      <div class="p-user-card__header">
        <div class="p-user-card__header-left">
          <p class="p-user-card__title">
            {{ pTitle }}
          </p>
          <PTag
            v-if="!!pTag"
            :pEffect="pTag.pEffect"
            :pSize="pTag.pSize"
            :pRound="pTag.pRound"
            :pDisableTransitions="pTag.pDisableTransitions"
            :pClosable="pTag.pClosable"
            :pContent="pTag.pContent"
            :pIconLeft="pTag.pIconLeft"
            :pIconRight="pTag.pIconRight"
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
      <p v-if="pDescription" class="p-user-card__description">
        {{ pDescription }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue'
import PImage from '@/atoms/PImage'
import PAvatar from '@/atoms/PAvatar'
import PTag from '@/atoms/PTag'
import type { PUserCardProps } from './PUserCardTypes'

defineProps<PUserCardProps>()

const slots = useSlots()
</script>

<style lang="scss" scoped>
.p-user-card {
  $self: &;

  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 4px;
  background: var(--el-color-persian-50);

  &__left {
    margin-right: 12px;
    flex-grow: 0;
    flex-shrink: 0;
  }

  &__image {
    flex-grow: 0;
    flex-shrink: 0;
    height: 95px;
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
    color: var(--el-color-neutral-gray-900);
  }

  &__subtitle {
    max-width: 100%;
    margin-top: 4px;
    font-size: 1.6rem;
    line-height: 1.3;
    color: var(--el-color-neutral-gray-500);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__description {
    margin-top: 4px;
    font-size: 1.2rem;
    line-height: 1.2;
    color: var(--el-color-neutral-gray-500);
  }
}
</style>
