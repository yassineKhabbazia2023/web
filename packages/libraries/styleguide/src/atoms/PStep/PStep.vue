<template>
  <ElStep
    :title="pTitle"
    :description="pDescription"
    :status="pStatus"
  />
</template>

<script lang="ts" setup>
import { ElStep } from 'element-plus'
import type { PStepProps } from './PStepTypes'

withDefaults(defineProps<PStepProps>(), {
  pTitle: '',
  pDescription: '',
  pIcon: undefined,
  pStatus: '',
})
</script>
