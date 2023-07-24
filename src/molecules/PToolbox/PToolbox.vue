<template>
  <el-dropdown
    popperClass="p-toolbox"
    placement="bottom-start"
  >
    <slot />
    <template #dropdown>
      <el-dropdown-menu>
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
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ElDropdown, ElDropdownMenu } from 'element-plus'
import PToolboxItem from '@/atoms/PToolboxItem'
import { iconsResolver } from '@/utils/iconResolver'

type ToolboxLine = {
  iconName: string;
  value: string;
  actionName: string;
};

interface PToolboxProps {
  elements: Array<ToolboxLine>;
}

const props = defineProps<PToolboxProps>()
defineEmits(['p-toolbox-item-clicked'])

const resolvedIcons = iconsResolver(props.elements, 'iconName')
</script>
