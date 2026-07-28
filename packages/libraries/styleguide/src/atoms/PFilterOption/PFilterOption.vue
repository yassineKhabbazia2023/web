<template>
  <button
    :class="[
      cssClass,
      'p-filter-option',
      'flex flex--align-items-center',
      'padding-x--3'
    ]"
    :disabled="pDisabled"
    @click="handleClick"
  >
    <span
      v-if="hasValue"
      class="
        p-filter-option__number
        font-semibold padding-left--1"
    >
      {{ pValue }}
    </span>
    <span v-if="hasValue" class="p-filter-option__icon padding-x--2 font-large font-normal"> | </span>
    <PTag
      class="p-filter-option__tag padding-x--0"
      :pContent="pContent"
      :pColor="colorMapper"
      :pIconLeftName="pIconName"
    />
    <PIcon
      v-if="isSelected && !pDisabled"
      size="12px"
      class="p-filter-option__icon"
      pName="x"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { isNotNullNorEmpty } from '@pulse/toolbox'
import PTag from '../../atoms/PTag'
import PIcon from '../../atoms/PIcon'
import type { PFilterOptionProps } from './PFilterOptionTypes'

const emit = defineEmits<{
  'update:p-selected': [boolean]
}>()

const props = withDefaults(defineProps<PFilterOptionProps>(), {
  pSelected: false,
  pColor: 'light-gray',
})

const hasValue = computed(() => isNotNullNorEmpty(props.pValue))

const isSelected = computed({
  get() {
    return props.pSelected
  },
  set(val) {
    emit('update:p-selected', val)
  },
})

const handleClick = () => {
  isSelected.value = !isSelected.value
}

const cssClass = computed(() => ({
  'p-filter-option--selected': isSelected.value,
  'p-filter-option--disabled': props.pDisabled,
  [`p-filter-option--color-${props.pColor}`]: true,
}))

const colorMapper = computed(() => {
  return props.pDisabled ? 'light-gray' : props.pColor
})
</script>

<style lang="scss" scoped>
.p-filter-option {
  $self: &;
  height: 32px;
  border: 1px solid transparent;
  cursor: pointer;
  padding-top: 5px;
  padding-bottom: 5px;
  transition: border-color var(--el-transition-duration) ease, background-color var(--el-transition-duration) ease;

  &--color-default {
    &:hover {
      border-color: var(--p-jungle-700);
    }
    background-color: var(--p-jungle-100);
    #{$self}__icon {
      color: var(--p-jungle-700);
    }
  }

  &--color-success {
    &:hover {
      border-color: var(--p-green-500);
    }
    background-color: var(--p-green-100);
    #{$self}__icon {
      color: var(--p-green-800);
    }
  }

  &--color-warning {
    &:hover {
      border-color: var(--p-orange-500);
    }
    background-color: var(--p-orange-100);
    #{$self}__icon {
      color: var(--p-orange-800);
    }
  }

  &--color-amethyste {
    &:hover {
      border-color: var(--p-black-rock-700);
    }
    background-color: var(--p-black-rock-100);
    #{$self}__icon {
      color: var(--p-black-rock-700);
    }
  }

  &--color-danger {
    &:hover {
      border-color: var(--p-red-500);
    }
    background-color: var(--p-red-100);
    #{$self}__icon {
      color: var(--p-red-800);
    }
  }

  &--color-light-green {
    &:hover {
      border-color: var(--p-jungle-700);
    }
    background-color: var(--p-jungle-50);
    #{$self}__icon {
      color: var(--p-jungle-700);
    }
  }

  &--color-light-blue {
    &:hover {
      border-color: var(--p-teal-800);
    }
    background-color: var(--p-teal-100);
    #{$self}__icon {
      color: var(--p-teal-800);
    }
  }

  &--color-blue {
    &:hover {
      border-color: var(--p-black-rock-800);
    }
    background-color: var(--p-black-rock-100);
    #{$self}__icon {
      color: var(--p-black-rock-800);
    }
  }

  &--color-tranquil {
    &:hover {
      border-color: var(--p-mint-tulip-800);
    }
    background-color: var(--p-tranquil-50);
    #{$self}__icon {
      color: var(--p-mint-tulip-800);
    }
  }

  &--color-purple {
    &:hover {
      border-color: var(--p-persian-500);
    }
    background-color: var(--p-persian-100);
    #{$self}__icon {
      color: var(--p-persian-500);
    }
  }

  &--color-disabled {
    &:hover {
      border-color: var(--p-text-disabled);
    }
    background-color: var(--p-surface-state-disabled);
  }

  &--color-light-gray {
    &:hover {
      border-color: var(--p-black-rock-900);
    }
    background-color: var(--p-gray-50);
  }

  &--color-gray {
    &:hover {
      border-color: var(--p-black-rock-900);
    }
    background-color: var(--p-gray-100);
  }

  &--selected {
    &#{$self}--color-default {
      background-color: var(--p-jungle-100);
      border-color: var(--p-jungle-700);
    }

    &#{$self}--color-success {
      background-color: var(--p-green-100);
      border-color: var(--p-green-500);
    }

    &#{$self}--color-warning {
      background-color: var(--p-orange-100);
      border-color: var(--p-orange-500);
    }

    &#{$self}--color-amethyste {
      background-color: var(--p-black-rock-100);
      border-color: var(--p-black-rock-700);
    }

    &#{$self}--color-danger {
      background-color: var(--p-red-100);
      border-color: var(--p-red-500);
    }

    &#{$self}--color-light-green {
      background-color: var(--p-jungle-50);
      border-color: var(--p-jungle-700);
    }

    &#{$self}--color-light-blue {
      background-color: var(--p-teal-100);
      border-color: var(--p-teal-800);
    }

    &#{$self}--color-blue {
      background-color: var(--p-black-rock-100);
      border-color: var(--p-black-rock-800);
    }

    &#{$self}--color-tranquil {
      background-color: var(--p-tranquil-50);
      border-color: var(--p-mint-tulip-800);
    }

    &#{$self}--color-purple {
      background-color: var(--p-persian-100);
      border-color: var(--p-persian-500);
    }

    &#{$self}--color-disabled {
      background-color: var(--p-surface-state-disabled);
      border-color: var(--p-text-disabled);
    }

  }

  &--disabled {
    pointer-events: none;
    background-color: var(--p-gray-50);
  }

  &__number {
    font-size: var(--el-font-size-base);
    color: var(--p-gray-900);
  }
}
</style>
