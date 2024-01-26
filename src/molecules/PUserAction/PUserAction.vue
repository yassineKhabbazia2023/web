<template>
    <div
      class="p-user-action padding-y--2 flex flex--align-items-center flex--justify-content-space-between"
    >
    <div v-if="pProfile">
      <PAvatar
        data-testid="profile"
        pShape="circle"
        pColor="persian-gradient">
        {{ pProfile }}
      </PAvatar>
    </div>
    <div class="flex--grow-1">
      <div class="p-user-action__title">
        {{ pTitle }}
      </div>
      <div class="p-user-action__description margin-top--1">
        {{ pDescription }}
      </div>
    </div>
      <PTag
        v-if="pTagContent"
        pColor="gray-100"
        :pContent="pTagContent"
        pEffect="plain"
        data-testid="tagContent"
      />
      <p
        v-if="pRole"
        class="p-user-action__role"
      >
        {{ pRole }}
      </p>
      <PInput
        v-if="pShowInput"
        v-model="internalValue"
        :pPlaceholder="pInputPlaceholder"
        class="p-user-action__input"
      />
      <PDropdown
        v-if="pShowOptions"
        v-model="internalDropdownValue"
        :pPlaceholder="pOptionsPlaceholder"
        :pOptions="pOptions"
        data-testid="options"
      />
      <div
        v-if="pShowDelete"
        class="p-user-action__delete
          flex
          flex-grow-0
          flex-shrink-0
          flex--align-items-center
          flex--justify-content-center
        "
      >
        <PIcon
          @click="emit('click-delete')"
          class="cursor-pointer"
          color="#5546FF"
          data-testid="delete-icon"
        >
          <PITrash />
        </PIcon>
      </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PAvatar from '@/atoms/PAvatar'
import PTag from '@/atoms/PTag'
import PInput from '@/atoms/PInput'
import PIcon from '@/atoms/PIcon'
import PDropdown from '@/molecules/PDropdown'
import { PITrash } from '@/atoms/PIcon/components'
import type { PUserActionProps, POptionsValue } from './PUserActionTypes'

const emit = defineEmits<{
  'click-delete': [],
  'update:pInputValue': [string],
  'update:pOptionsValue': [POptionsValue]
}>()

const props = withDefaults(defineProps<PUserActionProps>(), {
  pRole: '',
  pShowDelete: false,
  pTagContent: '',
  pShowInput: false,
  pInputValue: '',
  pShowOptions: false,
  pOptionsPlaceholder: '',
  pOptions: () => []
})

const internalValue = computed({
  get() {
    return props.pInputValue
  },
  set(value: string) {
    emit('update:pInputValue', value)
  }
})

const internalDropdownValue = computed({
  get() {
    return props.pOptionsValue
  },
  set(value: POptionsValue) {
    emit('update:pOptionsValue', value)
  }
})
</script>

<style lang="scss" scoped>
.p-user-action {
  gap: 8px;

  &__title {
    font-weight: 600;
  }

  &__description {
    color: var(--el-color-neutral-gray-500);
    font-size: 1.2rem;
  }

  &__role {
    color: var(--el-color-neutral-gray-300);
  }

  &__input {
    width: inherit;
  }

  &__delete {
    flex-basis: 40px;
  }
}
</style>
