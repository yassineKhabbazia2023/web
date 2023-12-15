<template>
  <ElTimePicker
    :readonly="pReadonly"
    :disabled="pDisabled"
    :editable="pEditable"
    :clearable="pClearable"
    :size="pSize"
    :placeholder="pPlaceholder"
    :startPlaceholder="pStartPlaceholder"
    :endPlaceholder="pEndPlaceholder"
    :isRange="pIsRange"
    :arrowControl="pArrowControl"
    :popperClass="pPopperClass"
    :rangeSeparator="pRangeSeparator"
    :format="pFormat"
    :defaultValue="pDefaultValue"
    :id="pId"
    :name="pName"
    :label="pLabel"
    :prefixIcon="pPrefixIcon"
    :clearIcon="pClearIcon"
    :disabledHours="pDisabledHours"
    :disabledMinutes="pDisabledMinutes"
    :disabledSeconds="pDisabledSeconds"
    :teleported="pTeleported"
    :tabindex="pTabindex"
  >
    <slot />
  </ElTimePicker>
</template>

<script lang="ts" setup>
import { ElTimePicker } from 'element-plus'
import type { PTimePickerProps } from './PTimePickerTypes'

withDefaults(defineProps<PTimePickerProps>(), {
  pReadonly: false,
  pDisabled: false,
  pEditable: true,
  pClearable: true,
  pSize: undefined,
  pPlaceholder: '',
  pStartPlaceholder: undefined,
  pEndPlaceholder: undefined,
  pIsRange: false,
  pArrowControl: false,
  pPopperClass: '',
  pRangeSeparator: '-',
  pFormat: undefined,
  pDefaultValue: undefined,
  pId: undefined,
  pName: '',
  pLabel: undefined,
  pPrefixIcon: '',
  pClearIcon: '',
  pDisabledHours: undefined,
  pDisabledMinutes: undefined,
  pDisabledSeconds: undefined,
  pTeleported: true,
  pTabindex: 0
})
</script>
