<template>
  <div
    class="
      p-user-action-card
      flex
      flex--justify-content-space-between
      flex--align-items-stretch
      bg--white
      padding-x--4
      padding-y--2
    "
  >
    <div
      class="
        flex
        flex--align-items-center
        flex-gap--3
      "
    >
      <PAvatar v-bind="pAvatarProps">
        <slot name="avatar" />
      </PAvatar>
      <div
        class="
          flex
          flex--direction-column
          flex--justify-content-space-between
        "
      >
        <p class="font-bold font-size--14">
          {{ pTopLeftSectionText }}
        </p>
        <p class="font-size--12 text-color--text-neutral margin-top--1">
          {{ pTopLeftSubText }}
        </p>
      </div>
    </div>

    <div
      class="
        flex
        flex--align-items-center
        flex-gap--2
      "
    >
      <slot name="right-section" />
      <slot name="actions">
        <PButton
          v-if="pIsTrashIconVisible"
          pIconOnly
          pType="default"
          pSize="small"
          @click="emit('trash-clicked')"
        >
          <PIcon pName="trash" />
        </PButton>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PAvatar from '../PAvatar/PAvatar.vue'
import PButton from '../PButton/PButton.vue'
import PIcon from '../PIcon/PIcon.vue'
import type { PUserActionCardProps } from './p-user-action-card.types'

withDefaults(defineProps<PUserActionCardProps>(), {
  pIsTrashIconVisible: true,
})

const emit = defineEmits<{
  'trash-clicked': []
}>()

</script>
