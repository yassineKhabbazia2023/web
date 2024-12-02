<template>
  <button
    :class="[
      cssClass,
      'p-filter-option',
      'flex flex--align-items-center',
      'radius--2',
      'padding-left--3 padding-right--2'
    ]"
    :disabled="pDisabled"
    @click="handleClick"
  >
    <span
      v-if="pValue !== undefined"
      class="
        p-filter-option__number
        font-semibold"
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
  // TO DO: color wil be update later
  $functional-green-hover: #B7FDB5;
  $functional-green-selected: #7DF97C;
  $functional-warning-hover: #FFF5C5;
  $functional-warning-selected: #FFDA47;
  $functional-danger-hover: #FFC8C8;
  $functional-danger-selected: #FFA2A2;
  $functional-fuschia-hover: #D4D6FF;
  $functional-fuschia-selected: #B2B4FF;
  border: 1px solid transparent;
  cursor: pointer;
  padding-top: 5px;
  padding-bottom: 5px;
  transition: border-color var(--el-transition-duration) ease, background var(--el-transition-duration) ease;

  &--color-success {
    background: var(--el-color-functionnal-green-bg);
    #{$self}__icon {
      color: var(--el-color-functionnal-green-txt);
    }
  }

  &--color-warning {
    background: var(--el-color-functionnal-orange-bg);

    #{$self}__icon {
      color: var(--el-color-functionnal-orange-txt);
    }
  }

  &--color-amethyste {
    background: var(--el-color-secondary-amethyste-bg);
    #{$self}__icon {
      color: var(--el-color-secondary-amethyste-txt);
    }
  }

  &--color-fuschia {
    background: var(--el-color-secondary-fuschia-bg);
    #{$self}__icon {
      color: var(--el-color-secondary-fuschia-txt);
    }
  }

  &--color-danger {
    background: var(--el-color-functionnal-red-bg);

    #{$self}__icon {
      color: var(--el-color-functionnal-red-txt);
    }
  }

  &--color-gray-500 {
    background-color: var(--el-color-neutral-gray-100);
  }

  &--color-gray-900 {
    background-color: var(--el-color-neutral-gray-100);
  }

  &--selected {
    &#{$self}--color-success {
      background-color: $functional-green-selected;
      span.el-tag {
        &.el-tag--success {
          background-color: $functional-green-selected;
          border-color: $functional-green-selected;
        }
      }
    }

    &#{$self}--color-warning {
      background-color: $functional-warning-selected;
      span.el-tag {
        &.el-tag--warning {
          background-color: $functional-warning-selected;
          border-color: $functional-warning-selected;
        }
      }
    }

    &#{$self}--color-amethyste {
      background-color: var(--el-color-secondary-amethyste);
      span.el-tag {
        &.el-tag--amethyste {
          background-color: var(--el-color-secondary-amethyste);
          border-color: var(--el-color-secondary-amethyste);
        }
      }
    }

    &#{$self}--color-danger {
      background-color: $functional-danger-selected;
      span.el-tag {
        &.el-tag--danger {
          background-color: $functional-danger-selected;
          border-color: $functional-danger-selected;
        }
      }
    }

    &#{$self}--color-gray-900 {
      background-color: var(--el-color-neutral-gray-300);
      span.el-tag {
        &.el-tag--gray-900 {
          background-color: var(--el-color-neutral-gray-300);
          border-color: var(--el-color-neutral-gray-300);
        }
      }
    }

    &#{$self}--color-fuschia {
      background-color: $functional-fuschia-selected;
      span.el-tag {
        &.el-tag--fuschia {
          background-color: $functional-fuschia-selected;
          border-color: $functional-fuschia-selected;
        }
      }
    }
  }

  &:hover {
    &#{$self}--color-success {
      background-color: $functional-green-hover;
      span.el-tag {
        &.el-tag--success {
          background-color: $functional-green-hover;
          border-color: $functional-green-hover;
        }
      }
    }

    &#{$self}--color-warning {
      background-color: $functional-warning-hover;
      span.el-tag {
        &.el-tag--warning {
          background-color: $functional-warning-hover;
          border-color: $functional-warning-hover;
        }
      }
    }

    &#{$self}--color-amethyste {
      background-color: var(--el-color-secondary-amethyste-bg);
      span.el-tag {
        &.el-tag--amethyste {
          background-color: var(--el-color-secondary-amethyste-bg);
          border-color: var(--el-color-secondary-amethyste-bg);
        }
      }
    }

    &#{$self}--color-fuschia {
      background-color: $functional-fuschia-hover;
      span.el-tag {
        &.el-tag--fuschia {
          background-color: $functional-fuschia-hover;
          border-color: $functional-fuschia-hover;
        }
      }
    }

    &#{$self}--color-danger {
      background-color: $functional-danger-hover;
      span.el-tag {
        &.el-tag--danger {
          background-color: $functional-danger-hover;
          border-color: $functional-danger-hover;
        }
      }
    }

    &#{$self}--color-gray-900 {
      background-color: var(--el-color-neutral-gray-200);
      span.el-tag {
        &.el-tag--gray-900 {
          background-color: var(--el-color-neutral-gray-200);
          border-color: var(--el-color-neutral-gray-200);
        }
      }
    }
  }

  &--disabled {
    pointer-events: none;
    border-color: var(--el-color-neutral-gray-50);
  }

  &__number {
    font-size: var(--el-font-size-base);
    color: var(--el-color-neutral-gray-900);
  }
}
</style>
