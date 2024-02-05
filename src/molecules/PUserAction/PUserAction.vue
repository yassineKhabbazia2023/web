<template>
    <div
      class="p-user-action flex-gap--3 padding-y--2 flex flex--align-items-center flex--justify-content-space-between"
    >
      <div v-if="pProfile">
        <PAvatar
          data-testid="profile"
          pShape="circle"
          pType="small"
          pColor="persian-gradient"
        >
          {{ pProfile }}
        </PAvatar>
      </div>
      <div class="flex--grow-1 p-user-action__text">
        <p
          class="p-user-action__title"
          :title="pTitle"
        >
          {{ pTitle }}
        </p>
        <p
          class="p-user-action__description margin-top--1"
          :title="pDescription"
        >
          {{ pDescription }}
        </p>
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
        class="p-user-action__input flex--grow-1"
      />
      <PDropdown
        class="flex--grow-1 p-user-action__dropdown"
        v-if="pShowOptions"
        v-model="internalDropdownValue"
        :pPlaceholder="pOptionsPlaceholder"
        :pOptions="pOptions"
        data-testid="options"
      />

      <PButton
        v-if="pShowDelete"
        class="p-user-action__delete
          flex
          flex-grow-0
          flex-shrink-0
          flex--align-items-center
          flex--justify-content-center
          el-button--icon
        "
        pType="white"
        :pCircle="false"
        pSize="default"
        @click="emit('click-delete')"
        data-testid="delete-icon"
      >
        <PIcon
          color="#5546FF"
        >
          <PITrash />
        </PIcon>
      </PButton>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PAvatar from '@/atoms/PAvatar'
import PButton from '@/atoms/PButton'
import PDropdown from '@/molecules/PDropdown'
import PIcon from '@/atoms/PIcon'
import PInput from '@/atoms/PInput'
import PTag from '@/atoms/PTag'
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
  &__text {
    max-width: 40%;
  }

  &__title {
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__description {
    color: var(--el-color-neutral-gray-500);
    font-size: 1.2rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__role {
    color: var(--el-color-neutral-gray-300);
  }

  &__input,
  &__dropdown {
    width: 100%;
    max-width: 260px;
  }

  &__delete {
    flex-basis: 40px;
  }
}
</style>
