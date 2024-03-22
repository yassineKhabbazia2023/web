<template>
  <PButton
    pType="default"
    pSize="default"
    :class="[
      { 'non-clickable': !clickable },
      'filter-option',
      `filter-option--${color}`,
      cssClass,
      'shadow--3',
      'flex flex--align-items-center',
      'radius--2'
    ]"
    @click="handleClick"
  >
    <span
      class="
      filter-option__number
      font-semibold
      margin-right--3
  ">
      {{ number }}
    </span>
    <PTag
      class="filter-option__tag"
      :pContent="content"
      :pColor="color"
      :pIconLeft="icon"
      pEffect="light"
    />
    <PIcon
      v-if="isSelected"
      size="12px"
      class="filter-option__icon"
    >
      <PIXCircleFill/>
    </PIcon>
  </PButton>
</template>

<script setup lang="ts">
import {
  PTag,
  PButton,
  PIcon,
  PIXCircleFill,
} from '@kpmg/styleguide'
import { computed } from 'vue'
import type { IProps } from './types'
const emit = defineEmits<{
  'click': []
  'close': []
}>()

const handleClick = () => {
  props.isSelected ? emit('close') : emit('click')
}
const props = withDefaults(defineProps<IProps>(), {
  isSelected: false,
  clickable: false,
})

const cssClass = computed(() => {
  return props.isSelected ? 'filter-option--is-selected' : ''
})
</script>

<style lang="scss" scoped>
.non-clickable {
  pointer-events: none;
}
.filter-option {
  transition: border var(--el-transition-duration) ease, background var(--el-transition-duration) ease;
  &--success {
    border: 1px solid var(--el-color-functionnal-green-bg);
    .filter-option__icon {
      color: var(--el-color-functionnal-green);
    }
  }
  &--warning {
    border: 1px solid var(--el-color-functionnal-orange-bg);
    .filter-option__icon {
      color: var(--el-color-functionnal-orange-txt);
    }
  }
  &--amethyste {
    border: 1px solid var(--el-color-secondary-amethyste-bg);
    .filter-option__icon {
      color: var(--el-color-secondary-amethyste);
    }
  }
  &:hover,
  &--is-selected
   {
    &.filter-option--success {
      border: 1px solid var(--el-color-functionnal-green);
      background-color: var(--el-color-functionnal-green-bg);
    }
    &.filter-option--warning {
      border: 1px solid var(--el-color-functionnal-orange-txt);
      background-color: var(--el-color-functionnal-orange-bg);
    }
    &.filter-option--amethyste {
      border: 1px solid var(--el-color-secondary-amethyste);
      background-color: var(--el-color-secondary-amethyste-bg);
    }
  }
  &__number {
    font-size: var(--el-font-size-medium);
    color: var(--el-color-neutral-gray-900);
  }
}
</style>
