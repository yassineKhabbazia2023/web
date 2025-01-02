<template>
  <ElTimePicker
    :id="pId"
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
    :name="pName"
    :label="pLabel"
    :disabledHours="pDisabledHours"
    :disabledMinutes="pDisabledMinutes"
    :disabledSeconds="pDisabledSeconds"
    :teleported="pTeleported"
    :tabindex="pTabindex"
  />
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

  pDisabledHours: undefined,
  pDisabledMinutes: undefined,
  pDisabledSeconds: undefined,
  pTeleported: true,
  pTabindex: 0,
})
</script>
