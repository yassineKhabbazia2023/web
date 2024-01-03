<template>
  <ElSwitch
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
    :activeColor="pActiveColor"
    :inactiveColor="pInactiveColor"
    :borderColor="pBorderColor"
    :name="pName"
    :validateEvent="pValidateEvent"
    :beforeChange="pBeforeChange"
    :id="pId"
    :tabIndex="pTabIndex"
    :label="pLabel"
  />
</template>

<script setup lang="ts">
import { ElSwitch } from 'element-plus'
import type { PSwitchProps } from './PSwitchTypes'

withDefaults(defineProps<PSwitchProps>(), {
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
  pLabel: undefined
})
</script>
