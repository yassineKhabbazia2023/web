<template>
  <div class="p-file-card radius--2 shadow--2">
    <div class="p-file-card__icon" v-if="pHasIcon">
      <slot name="icon" />
    </div>
    <div class="p-file-card__text">
      <p class="p-file-card__name">
        {{ pName }}
      </p>
      <p class="p-file-card__size">
        {{ pFormat }} • {{ pSize }}
      </p>
    </div>
    <div class="p-file-card__group-btn" v-if="pHasButton">
      <slot name="buttons" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PFileCardProps } from './PFileCardTypes'

withDefaults(defineProps<PFileCardProps>(), {
  pHasIcon: false,
  pHasButton: false
})
</script>

<style lang="scss" scoped>
.p-file-card {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 16px;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 8px;
    margin-right: 1.6rem;
    font-size: 2.4rem;
    color: var(--el-color-neutral-gray-300);
  }

  &__text {
    width: 100%;
    overflow: hidden;
  }

  &__name {
    margin-bottom: 4px;
    font-size: 1.4rem;
    line-height: 1.2;
    color: var(--el-color-neutral-gray-900);
    text-overflow: ellipsis;
    white-space: nowrap;

    @media screen and (max-width: 767px) {
      display: -webkit-box;
      -webkit-line-clamp: 2; /* number of lines to show */
              line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      white-space: normal;
      min-height: 1.8rem;
    }
  }

  &__size {
    font-size: 1.2rem;
    line-height: 1.2;
    color: var(--el-color-neutral-gray-500);
  }

  &__group-btn {
    flex-grow: 0;
    flex-shrink: 0;

    .el-button {
      margin-left: 1.6rem;
    }
  }
}
</style>
