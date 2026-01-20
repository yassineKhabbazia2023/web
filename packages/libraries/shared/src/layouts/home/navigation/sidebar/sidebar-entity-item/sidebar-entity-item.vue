<template>
  <PButton
    class="sidenav-entity__item padding--0"
    @click="onItemClicked"
  >
    <PTooltip
      :pContent="tooltipContent"
      pPlacement="left"
      :disabled="tooltipDisabled"
    >
      <slot />
    </PTooltip>
    <slot name="suffix-content" />
  </PButton>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { PButton, PTooltip } from '@pulse/styleguide/components'
import type { SidebarEntityItemProps } from './sidebar-entity-item.type'

const router = useRouter()

const props = defineProps<SidebarEntityItemProps>()
const emit = defineEmits<{
  'item-clicked': []
}>()

const onItemClicked = () => {
  emit('item-clicked')
  if (props.route) {
    router.push(props.route)
  }
}
</script>

<style scoped lang="scss">
.sidenav-entity__item {
  z-index: 8;
  height: 32px;
  outline: none;
}
</style>
