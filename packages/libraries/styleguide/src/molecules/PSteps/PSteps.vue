<template>
  <ElSteps
    :space="pSpace"
    :direction="pDirection"
    :active="pActive"
    :processStatus="pProcessStatus"
    :finishStatus="pFinishStatus"
    :simple="pSimple"
    :alignCenter="pAlignCenter"
    :data-testid="pTestId"
  >
    <ElStep
      v-for="(stepItem, stepIndex) in resolvedStepItems"
      :key="stepIndex"
      :title="stepItem.pTitle"
      :description="stepItem.pDescription"
      :status="stepItem.pStatus"
      :icon="stepItem.pIcon"
      :class="stepItem.class"
      :style="stepItem.style"
      :data-testid="stepItem.pDataTestId"
    />
  </ElSteps>
</template>

<script setup lang="ts">
import { ElStep, ElSteps } from 'element-plus'
import { computed } from 'vue'
import type { Component } from 'vue'
import { PStepStatus } from './PSteps.enums'
import PICheck from '../../atoms/PIcon/components/PICheck.vue'
import PIX from '../../atoms/PIcon/components/PIX.vue'
import type { PStepsItem, PStepsProps } from './PStepsTypes'

type StepRenderItem = PStepsItem & { pStatus: PStepStatus }

const props = withDefaults(defineProps<PStepsProps>(), {
  pSpace: '',
  pDirection: 'horizontal',
  pActive: 0,
  pProcessStatus: PStepStatus.PROCESS,
  pFinishStatus: PStepStatus.SUCCESS,
  pAlignCenter: undefined,
  pSimple: undefined,
  pSteps: () => [],
})

const resolveStepStatus = (
  explicitStepStatus: PStepStatus | undefined,
  stepIndex: number,
  previousStepStatus: PStepStatus,
): PStepStatus => {
  if (explicitStepStatus !== undefined && explicitStepStatus !== PStepStatus.EMPTY) {
    return explicitStepStatus
  }

  if (props.pActive > stepIndex) {
    return props.pFinishStatus
  }

  if (props.pActive === stepIndex && previousStepStatus !== PStepStatus.ERROR) {
    return props.pProcessStatus
  }

  return PStepStatus.WAIT
}

const resolveStepIcon = (
  explicitStepIcon: PStepsItem['pIcon'],
  resolvedStepStatus: PStepStatus,
): PStepsItem['pIcon'] => {
  if (explicitStepIcon !== undefined) {
    return explicitStepIcon
  }

  if (resolvedStepStatus === PStepStatus.SUCCESS) {
    return PICheck as Component
  }

  if (resolvedStepStatus === PStepStatus.ERROR) {
    return PIX as Component
  }

  return undefined
}

const resolvedStepItems = computed<StepRenderItem[]>(() => {
  const resolvedStatuses: PStepStatus[] = []

  return props.pSteps.map((stepItem, stepIndex) => {
    const previousStepStatus = stepIndex === 0
      ? PStepStatus.WAIT
      : resolvedStatuses[stepIndex - 1]

    const resolvedStepStatus = resolveStepStatus(stepItem.pStatus, stepIndex, previousStepStatus)
    resolvedStatuses.push(resolvedStepStatus)

    const resolvedStepIcon = resolveStepIcon(stepItem.pIcon, resolvedStepStatus)

    return {
      ...stepItem,
      pStatus: resolvedStepStatus,
      pIcon: resolvedStepIcon,
    }
  })
})
</script>
