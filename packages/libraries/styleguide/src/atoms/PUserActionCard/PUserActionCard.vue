<template>
  <div
    class="
      p-user-action-card
      flex
      bg--white
      padding-x--4
      padding-y--2
    "
    :class="layoutClass"
  >
    <!-- Primary row: info on the left, actions pinned top-right. Never wraps,
         so the actions stay in place whatever the info length. -->
    <div
      class="
        flex
        flex--align-items-center
        flex--justify-content-space-between
        flex--grow-1
        flex-gap--2
      "
    >
      <div
        class="
          p-user-action-card__info
          flex
          flex--align-items-center
          flex--grow-1
          flex-gap--3
        "
      >
        <PAvatar
          v-if="pIsAvatarVisible"
          v-bind="pAvatarProps"
        >
          <slot name="avatar" />
        </PAvatar>
        <div
          class="
            flex
            flex--direction-column
            flex--justify-content-space-between
          "
        >
          <slot name="content">
            <p class="font-bold font-size--14">
              {{ pTopLeftSectionText }}
            </p>
            <p class="font-size--12 text-color--text-neutral margin-top--1">
              {{ pTopLeftSubText }}
            </p>
          </slot>
        </div>
      </div>

      <div
        class="
          flex
          flex--align-items-center
          flex--shrink-0
          flex-gap--2
        "
      >
        <!-- On desktop the right-section stays inline; on mobile it drops to its own row below -->
        <slot
          v-if="isMobile === false"
          name="right-section"
        />
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

    <!-- Mobile: the right-section drops to its own full-width row below the primary row -->
    <div v-if="isMobile === true && hasRightSection === true">
      <slot name="right-section" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import PAvatar from '../PAvatar/PAvatar.vue'
import PButton from '../PButton/PButton.vue'
import PIcon from '../PIcon/PIcon.vue'
import { useResponsive } from '../../composables/use-responsive.composable'
import type { PUserActionCardProps } from './p-user-action-card.types'

withDefaults(defineProps<PUserActionCardProps>(), {
  pIsTrashIconVisible: true,
  pIsAvatarVisible: true,
})

const emit = defineEmits<{
  'trash-clicked': []
}>()

const { isMobile } = useResponsive()

const slots = useSlots()
const hasRightSection = computed(() => slots['right-section'] !== undefined)

const layoutClass = computed(() => isMobile.value === true
  ? 'flex--direction-column flex-gap--2'
  : 'flex--align-items-stretch')
</script>

<style lang="scss" scoped>
.p-user-action-card {
  &__info {
    // Let the text shrink and wrap instead of pushing the actions onto a new line
    min-width: 0;

    p {
      overflow-wrap: break-word;
    }
  }
}
</style>
