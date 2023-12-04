<template>
  <ElConfigProvider
    :locale="pLocale"
    :size="pSize"
    :zIndex="pZIndex"
    :namespace="pNamespace"
    :message="pMessage"
  >
    <slot />
  </ElConfigProvider>
</template>

<script lang="ts" setup>
import { ElConfigProvider } from 'element-plus'
import type { PConfigProviderProps } from './PConfigProviderTypes'
withDefaults(defineProps<PConfigProviderProps>(), {
  pLocale: undefined,
  pSize: 'default',
  pZIndex: 0,
  pNamespace: 'el',
  pMessage: undefined,
})
</script>
