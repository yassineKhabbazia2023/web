<template>
  <div
    class="
      p-user-action-card
      flex
      flex--justify-content-space-between
      flex--align-items-center
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
      <div>
        <p class="font-bold font-size--14">{{ pTopLeftSectionText }}</p>
        <p class="font-size--12 text-color--text-neutral">{{ pTopLeftSubText }}</p>
      </div>
    </div>

    <div>
      <PButton
        v-if="pIsTrashIconVisible"
        pIconOnly
        pType="default"
        pSize="small"
        @click="emit('trash-clicked')"
      >
        <PIcon pName="trash" />
      </PButton>
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
