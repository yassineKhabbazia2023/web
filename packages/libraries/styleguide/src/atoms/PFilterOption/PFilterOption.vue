<template>
  <button
    :class="[
      cssClass,
      'p-filter-option',
      'shadow--3',
      'flex flex--align-items-center',
      'radius--2',
      'padding-y--2 padding-x--3'
    ]"
    @click="handleClick"
    :disabled="pDisabled"
  >
    <span
      v-if="pValue !== undefined"
      class="
        p-filter-option__number
        font-semibold
        margin-right--3"
    >
      {{ pValue }}
    </span>
    <PTag
      class="p-filter-option__tag"
      :pContent="pContent"
      :pColor="colorMapper"
      :pIconLeft="pIcon"
      pEffect="light"
    />
    <PIcon
      v-if="isSelected && !pDisabled"
      size="12px"
      class="p-filter-option__icon"
    >
      <PIXCircleFill />
    </PIcon>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PTag from '@styleguide/atoms/PTag'
import PIcon from '@styleguide/atoms/PIcon'
import { PIXCircleFill } from '@styleguide/atoms/PIcon/components'
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
  background: var(--el-color-base-white);
  border: 1px solid var(--el-color-base-white);
  cursor: pointer;
  transition: border-color var(--el-transition-duration) ease, background var(--el-transition-duration) ease;

  &--color-success {
    border: 1px solid var(--el-color-functionnal-green-bg);

    #{$self}__icon {
      color: var(--el-color-functionnal-green);
    }
  }

  &--color-warning {
    border-color: var(--el-color-functionnal-orange-bg);

    #{$self}__icon {
      color: var(--el-color-functionnal-orange-txt);
    }
  }

  &--color-amethyste {
    border-color: var(--el-color-secondary-amethyste-bg);

    #{$self}__icon {
      color: var(--el-color-secondary-amethyste);
    }
  }

  &--color-danger {
    border-color: var(--el-color-functionnal-red-bg);

    #{$self}__icon {
      color: var(--el-color-functionnal-red);
    }
  }

  &--color-gray-500 {
    border-color: var(--el-color-neutral-gray-50);
  }

  &--color-gray-900 {
    border-color: var(--el-color-neutral-gray-100);
  }

  &--selected {
    &#{$self}--color-success {
      border-color: var(--el-color-functionnal-green);
    }

    &#{$self}--color-warning {
      border-color: var(--el-color-functionnal-orange-txt);
    }

    &#{$self}--color-amethyste {
      border-color: var(--el-color-secondary-amethyste);
    }

    &#{$self}--color-danger {
      border-color: var(--el-color-functionnal-red);
    }

    &#{$self}--color-gray-900 {
      border-color: var(--el-color-neutral-gray-900);
    }
  }

  &--selected,
  &:hover {
    &#{$self}--color-success {
      background-color: var(--el-color-functionnal-green-bg);
    }

    &#{$self}--color-warning {
      background-color: var(--el-color-functionnal-orange-bg);
    }

    &#{$self}--color-amethyste {
      background-color: var(--el-color-secondary-amethyste-bg);
    }

    &#{$self}--color-danger {
      background-color: var(--el-color-functionnal-red-bg);
    }

    &#{$self}--color-gray-900 {
      background-color: var(--el-color-neutral-gray-100);
    }
  }

  &--disabled {
    pointer-events: none;
    border-color: var(--el-color-neutral-gray-50);
  }

  &__number {
    font-size: var(--el-font-size-medium);
    color: var(--el-color-neutral-gray-900);
  }
}
</style>
