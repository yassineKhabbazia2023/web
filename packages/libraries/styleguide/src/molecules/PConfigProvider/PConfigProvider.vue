<template>
  <ElConfigProvider
    :locale="pLocale ?? defaultLocale"
    :size="pSize"
    :zIndex="pZIndex"
    :namespace="pNamespace"
    :button="pButton"
    :message="pMessage"
  >
    <slot />
  </ElConfigProvider>
</template>

<script lang="ts" setup>
import defaultLocale from 'element-plus/es/locale/lang/fr'
import { ElConfigProvider } from 'element-plus'
import type { PConfigProviderProps } from './PConfigProviderTypes'

withDefaults(defineProps<PConfigProviderProps>(), {
  pLocale: undefined,
  pSize: 'default',
  pZIndex: undefined,
  pNamespace: 'el',
  pButton: undefined,
  pMessage: undefined,
})
</script>
