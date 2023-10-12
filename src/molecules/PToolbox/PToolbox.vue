<template>
  <ElDropdown
    popperClass="p-toolbox shadow--3"
    placement="bottom-start"
  >
    <slot />
    <template #dropdown>
      <ElDropdownMenu>
        <PToolboxItem
          v-for="(element, index) in elements"
          :key="index"
          :value="element.value"
          :hasIcon="!!element.iconName"
          @click="$emit('p-toolbox-item-clicked', element.actionName)"
        >
          <template #icon>
            <PIcon size="16">
              <component :is="resolvedIcons[index]"></component>
            </PIcon>
          </template>
        </PToolboxItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElDropdown, ElDropdownMenu } from 'element-plus'
import PToolboxItem from '@/atoms/PToolboxItem'
import { iconsResolver } from '@/utils/iconResolver'

type ToolboxLine = {
  iconName: string;
  value: string;
  actionName: string;
};

export interface PToolboxProps {
  elements: Array<ToolboxLine>;
}

const props = defineProps<PToolboxProps>()
defineEmits(['p-toolbox-item-clicked'])

const resolvedIcons = computed(() => iconsResolver(props.elements, 'iconName'))
</script>
