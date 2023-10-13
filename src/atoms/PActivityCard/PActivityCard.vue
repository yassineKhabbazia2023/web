<template>
  <div class="p-activity-card radius--2 shadow--1">
    <div class="p-activity-card__avatar">
      <PAvatar
        color="white"
        type="xsmall"
      >
        {{ initialsTrim }}
      </PAvatar>
    </div>
    <div class="p-activity-card__content">
      <p class="p-activity-card__text font-normal">
        <slot />
      </p>
      <p class="p-activity-card__time font-small">
        {{ time }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import PAvatar from '@/atoms/PAvatar'
import type { PActivityProps } from './PActivityCardProps'

const props = defineProps<PActivityProps>()

const initialsTrim = computed(() => props.initials.substring(0, 2))
</script>

<style lang="scss" scoped>
.p-activity-card {
  display: flex;
  align-items: stretch;
  width: 100%;
  overflow: hidden;

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    flex-grow: 0;
    padding: 8px;
    background: var(--persian-gradient);
  }

  &__content {
    width: 100%;
    padding: 16px 8px;
    background: var(--el-color-white);
  }

  &__text {
    font-size: 1.4rem;
    color: var(--el-color-neutral-gray-900);
  }

  &__time {
    margin-top: 4px;
    color: var(--el-color-neutral-gray-500);
  }
}
</style>
