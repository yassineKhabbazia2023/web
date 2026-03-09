<template>
  <div class="p-progress">
    <div
      class="
        p-progress__header
        flex
        flex--justify-content-space-between
        flex--align-items-center
        margin-bottom--2
      "
    >
      <span
        class="p-progress__label font-semibold"
        data-testid="progress-label"
      >
        {{ pLabel }}
      </span>
      <span
        class="p-progress__percentage"
        data-testid="progress-percentage"
      >
        {{ pPercentage }}%
      </span>
    </div>
    <ElProgress
      :percentage="pPercentage"
      :show-text="false"
      :stroke-width="8"
      :color="AppColors.JUNGLE_400"
      data-testid="progress-bar"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElProgress } from 'element-plus'
import { AppColors } from '../../utils/AppColorsEnum'
import type { PProgressProps } from './PProgressTypes'

withDefaults(defineProps<PProgressProps>(), {
  pLabel: 'Progression',
})
</script>

<style lang="scss" scoped>
.p-progress {
  --el-border-color-lighter: var(--p-jungle-100);

  &__label {
    color: var(--p-gray-900);
    font-size: 14px;
    line-height: 1.5;
  }

  &__percentage {
    color: var(--p-gray-500);
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
  }
}
</style>
