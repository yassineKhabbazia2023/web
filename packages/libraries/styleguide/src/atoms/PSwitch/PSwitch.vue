<template>
  <ElSwitch
    :id="pId"
    v-model="modelValue"
    :disabled="isDisabled"
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
    :ariaLabel="pLabel"
    :style="cssStyle"
  />
</template>

<script setup lang="ts">
import { ElSwitch } from 'element-plus'
import { computed } from 'vue'
import type { PSwitchProps } from './PSwitchTypes'

const props = withDefaults(defineProps<PSwitchProps>(), {
  pDisabled: undefined,
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

const modelValue = defineModel<boolean>({ default: false })

// pLoading always forces disabled; otherwise fall through to pDisabled (which may be
// undefined) so ElSwitch's own form-context cascade can still apply when neither is set.
const isDisabled = computed(() => (props.pLoading === true ? true : props.pDisabled))

const cssStyle = computed(() => {
  const styles = [
    `--el-switch-border-color: ${props.pBorderColor}`,
    `--el-switch-on-color: ${props.pActiveColor}`,
    `--el-switch-off-color: ${props.pInactiveColor}`,
  ]
  return styles.join('; ')
})
</script>
