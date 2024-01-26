<template>
  <PButton
    pType="generic"
    @click="onItemClicked"
    class="sidenav-entity__item padding--0"
  >
    <PTooltip
      :pContent="tooltipContent"
      pPlacement="left"
      :disabled="tooltipDisabled"
    >
      <slot />
    </PTooltip>
    <slot name="suffix-content"/>
  </PButton>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { PButton, PTooltip } from '@kpmg/styleguide'
import type { SidebarEntityItemProps } from './SidebarEntityItemTypes'

const router = useRouter()

const props = defineProps<SidebarEntityItemProps>()
const emit = defineEmits<{
  'itemClicked': []
}>()

const onItemClicked = () => {
  emit('itemClicked')
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
