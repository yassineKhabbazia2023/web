<template>
  <component
    :is="componentType"
    v-bind="linkAttributes"
    class="
      mobile-user-menu-item
      flex
      flex--align-items-center
      flex--justify-content-space-between
      padding-y--4
    "
    @click="emit('click')"
  >
    <span class="mobile-user-menu-item__label font-small font-semibold">{{ label }}</span>
    <PIcon
      :pName="href ? 'link45deg' : 'arrowRight'"
      class="mobile-user-menu-item__icon"
    />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { PIcon } from '@pulse/styleguide/components'
import type { MobileUserMenuItemProps } from './mobile-user-menu-item.type'

const props = defineProps<MobileUserMenuItemProps>()

const componentType = computed(() => props.to ? RouterLink : 'a')

const linkAttributes = computed(() => {
  if (props.to) {
    return { to: props.to }
  }
  return {
    href: props.href,
    target: '_blank',
    rel: 'noopener',
  }
})

const emit = defineEmits<{
  click: []
}>()
</script>

<style lang="scss" scoped>
.mobile-user-menu-item {
  text-decoration: none;
  color: var(--p-black-rock-900);

  &:hover {
    color: var(--p-jungle-500);
  }

  &__icon {
    color: var(--p-gray-300);
  }
}
</style>
