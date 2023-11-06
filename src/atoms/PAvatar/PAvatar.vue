<template>
  <ElAvatar
    :fit="pFit"
    size="default"
    :class="pClassMapper"
    class="p-avatar"
    :src="pSrc"
    :shape="pShape"
  >
    <slot />
  </ElAvatar>
</template>

<script setup lang="ts">
import { ElAvatar } from 'element-plus'
import { computed } from 'vue'
import type { PAvatarProps } from './PAvatarTypes'

const props = withDefaults(defineProps<PAvatarProps>(), {
  pType: 'default',
  pFit: 'cover',
  pColor: 'persian-gradient',
  pSrc: '',
  pShape: 'circle'
})

const pClassMapper = computed(() => ({
  [`p-avatar--color-${props.pColor}`]: true,
  [`p-avatar--type-${props.pType}`]: true
}))

</script>
