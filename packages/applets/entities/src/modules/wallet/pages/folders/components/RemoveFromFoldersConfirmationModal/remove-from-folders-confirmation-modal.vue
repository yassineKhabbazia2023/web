<template>
  <PDialog
    v-model="isVisible"
    pWidth="566px"
    pAlignCenter
    pDestroyOnClose
    data-testid="remove-from-folders-confirmation-modal"
    @close="handleCancel"
  >
    <div
      class="
        flex
        flex--direction-column
        flex--align-items-center
        margin-bottom--6
        padding-right--6
      "
    >
      <PIcon
        pName="power"
        pSize="24"
        class="margin-bottom--4 margin-negative-top--2"
      />
      <p class="font-size--20 font-bold text-center">
        {{ title }}
      </p>
    </div>

    <p class="font-size--12 padding-right--6">
      {{ content }}
    </p>

    <template #footer>
      <div class="p-dialog__footer margin-y--2">
        <PButton
          pType="secondary"
          pSize="small"
          :pDisabled="isConfirmButtonLoading"
          data-testid="remove-from-folders-cancel-button"
          @click="handleCancel"
        >
          {{ t(`${I18N_KEY}.cancel`) }}
        </PButton>
        <PButton
          pType="primary"
          pSize="small"
          :pDisabled="selectedFoldersCount === 0"
          :pLoading="isConfirmButtonLoading"
          data-testid="remove-from-folders-confirm-button"
          @click="emit('confirm')"
        >
          {{ confirmButtonLabel }}
        </PButton>
      </div>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDialog, PButton, PIcon } from '@pulse/styleguide/components'
import type { RemoveFromFoldersConfirmationModalProps } from './remove-from-folders-confirmation-modal.types'

const I18N_KEY = 'entities.removeFromFoldersConfirmationModal'

const props = defineProps<RemoveFromFoldersConfirmationModalProps>()

const emit = defineEmits<{
  confirm: []
}>()

const isVisible = defineModel<boolean>({ required: true })

const { t } = useI18n()

const titleKey = computed(() => {
  if (props.hasRemainingCollaboratorFolder) {
    return `${I18N_KEY}.remainingCollaboratorTitle`
  }

  return `${I18N_KEY}.title`
})

const title = computed(() => t(titleKey.value, props.selectedFoldersCount))

const content = computed(() => t(
  props.hasRemainingCollaboratorFolder
    ? `${I18N_KEY}.remainingCollaboratorContent`
    : `${I18N_KEY}.content`,
  props.selectedFoldersCount,
))

const confirmButtonLabel = computed(() => t(
  props.hasRemainingCollaboratorFolder
    ? `${I18N_KEY}.remove`
    : `${I18N_KEY}.confirm`,
))

function handleCancel() {
  isVisible.value = false
}
</script>
