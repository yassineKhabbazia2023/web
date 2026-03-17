<template>
  <div
    class="margin-left--auto"
    aria-label="Drawer actions"
    role="group"
  >
    <PButton
      pType="secondary"
      pPlain
      pSize="default"
      class="margin-right--4"
      :aria-label="t('cancel')"
      :pDisabled="cancelDisabled"
      :data-testid="cancelTestId"
      @click="onCancel"
    >
      {{ t('cancel') }}
    </PButton>
    <PButton
      pType="primary"
      :aria-label="t('submit')"
      :pDisabled="submitDisabled"
      :pLoading="loading"
      :data-testid="submitTestId"
      @click="onSubmit"
    >
      {{ t('submit') }}
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton } from '@pulse/styleguide/components'
import type { DrawerActionButtonsProps } from './drawer-action-buttons.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      cancel: 'Cancel',
      submit: 'Submit',
    },
    'fr-FR': {
      cancel: 'Annuler',
      submit: 'Valider',
    },
  },
})

defineProps<DrawerActionButtonsProps>()

const emit = defineEmits<{
  'close-drawer': []
  'submit-action': []
}>()

const onCancel = () => {
  emit('close-drawer')
}

const onSubmit = () => {
  emit('submit-action')
}

</script>

