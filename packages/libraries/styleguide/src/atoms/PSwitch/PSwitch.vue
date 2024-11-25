<template>
  <ElSwitch
    :id="pId"
    :disabled="pDisabled"
    :loading="pLoading"
    :size="pSize"
    :width="pWidth"
    :inlinePrompt="pInlinePrompt"
    :activeIcon="pActiveIcon"
    :inactiveIcon="pInactiveIcon"
    :activeActionIcon="pActiveActionIcon"
    :inactiveActionIcon="pInactiveActionIcon"
    :activeText="pActiveText"
    :inactiveText="pInactiveText"
    :activeValue="pActiveValue"
    :inactiveValue="pInactiveValue"
    :name="pName"
    :validateEvent="pValidateEvent"
    :beforeChange="pBeforeChange"
    :tabIndex="pTabIndex"
    :label="pLabel"
    :style="cssStyle"
  />
</template>

<script setup lang="ts">
import { ElSwitch } from 'element-plus'
import { computed } from 'vue'
import type { PSwitchProps } from './PSwitchTypes'

const props = withDefaults(defineProps<PSwitchProps>(), {
  pDisabled: false,
  pLoading: false,
  pSize: '',
  pWidth: '',
  pInlinePrompt: false,
  pActiveIcon: undefined,
  pInactiveIcon: undefined,
  pActiveActionIcon: undefined,
  pInactiveActionIcon: undefined,
  pActiveText: '',
  pInactiveText: '',
  pActiveValue: true,
  pInactiveValue: false,
  pActiveColor: '',
  pInactiveColor: '',
  pBorderColor: '',
  pName: '',
  pValidateEvent: true,
  pBeforeChange: undefined,
  pId: undefined,
  pTabIndex: undefined,
  pLabel: undefined,
})

const cssStyle = computed(() => {
  const styles = [
    `--el-switch-border-color: ${props.pBorderColor}`,
    `--el-switch-on-color: ${props.pActiveColor}`,
    `--el-switch-off-color: ${props.pInactiveColor}`,
  ]
  return styles.join('; ')
})
</script>
