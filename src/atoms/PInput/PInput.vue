<template>
  <el-input>
    <slot />
  </el-input>
</template>

<script setup lang="ts">
import { ElInput, type InputProps } from 'element-plus'

withDefaults(defineProps<InputProps>(), {
  input: '',
  disabled: false,
  autosize: false,
  autocomplete: 'off',
  readonly: false,
  clearable: false,
  showPassword: false,
  showWordLimit: false,
  tabindex: undefined,
  validateEvent: true,
  inputStylets: {},
  inputStyle: undefined
})
</script>
