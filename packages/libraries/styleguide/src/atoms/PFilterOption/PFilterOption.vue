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
      v-if="pValue !== undefined"
      class="
        p-filter-option__number
        font-semibold padding-left--1"
    >
      {{ pValue }}
    </span>
    <span v-if="pValue !== undefined" class="p-filter-option__icon padding-x--2 font-large font-normal"> | </span>
    <PTag
      class="p-filter-option__tag padding-x--0"
      :pContent="pContent"
      :pColor="colorMapper"
      :pIconLeftName="pIconName"
      pEffect="light"
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
import PTag from '../../atoms/PTag'
import PIcon from '../../atoms/PIcon'
import type { PFilterOptionProps } from './PFilterOptionTypes'

const emit = defineEmits<{
  'update:p-selected': [boolean]
}>()

const props = withDefaults(defineProps<PFilterOptionProps>(), {
  pSelected: false,
  pColor: 'gray-500',
})

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
  return props.pDisabled ? 'gray-500' : props.pColor
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

  &--color-success {
    &:hover {
      border-color: var(--el-color-functionnal-green);
    }
    background-color: var(--el-color-functionnal-green-bg);
    #{$self}__icon {
      color: var(--el-color-functionnal-green-txt);
    }
  }

  &--color-warning {
    &:hover {
      border-color: var(--el-color-functionnal-orange);
    }
    background-color: var(--el-color-functionnal-orange-bg);
    #{$self}__icon {
      color: var(--el-color-functionnal-orange-txt);
    }
  }

  &--color-amethyste {
    &:hover {
      border-color: var(--el-color-secondary-fuschia);
    }
    background-color: var(--el-color-secondary-fuschia-bg);
    #{$self}__icon {
      color: var(--el-color-secondary-fuschia);
    }
  }

  &--color-fuschia {
    &:hover {
      border-color: var(--el-color-secondary-fuschia-txt);
    }
    background-color: var(--el-color-secondary-fuschia-bg);
    #{$self}__icon {
      color: var(--el-color-secondary-fuschia-txt);
    }
  }

  &--color-danger {
    &:hover {
      border-color: var(--el-color-functionnal-red);
    }
    background-color: var(--el-color-functionnal-red-bg);
    #{$self}__icon {
      color: var(--el-color-functionnal-red-txt);
    }
  }

  &--color-gray-500 {
    &:hover {
      border-color: var(--el-color-base-blue-pulse);
    }
    background-color: var(--el-color-neutral-gray-50);
  }

  &--color-gray-900 {
    &:hover {
      border-color: var(--el-color-base-blue-pulse);
    }
    background-color: var(--el-color-neutral-gray-100);
  }

  &--selected {
    &#{$self}--color-success {
      background-color: var(--el-color-functionnal-green-bg);
      border-color: var(--el-color-stroke-success);
    }

    &#{$self}--color-warning {
      background-color: var(--el-color-functionnal-orange-bg);
      border-color: var(--el-color-stroke-warning);
    }

    &#{$self}--color-amethyste {
      background-color: var(--el-color-secondary-fuschia-bg);
      border-color: var(--el-color-secondary-fuschia);
    }

    &#{$self}--color-danger {
      background-color: var(--el-color-functionnal-red-bg);
      border-color: var(--el-color-stroke-error);
    }

    &#{$self}--color-gray-900 {
      background-color: var(--el-color-neutral-gray-100);
      border-color: var(--el-color-base-blue-pulse);
    }

    &#{$self}--color-fuschia {
      background-color: var(--el-color-secondary-fuschia-bg);
      border-color: var(--el-color-functionnal-fuschia-txt);
    }
  }

  &--disabled {
    pointer-events: none;
    background-color: var(--el-color-neutral-gray-50);
  }

  &__number {
    font-size: var(--el-font-size-base);
    color: var(--el-color-neutral-gray-900);
  }
}
</style>
