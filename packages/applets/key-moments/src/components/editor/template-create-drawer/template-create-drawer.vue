<template>
  <PDrawer
    v-model="isOpen"
    :pTitle="drawerTitle"
    pSize="480px"
    pTestId="key-moments-settings-template-create-drawer"
    @close-drawer-button="close"
  >
    <PForm
      :pModel="form"
      pRequireAsteriskPosition="right"
    >
      <PFormItem
        :pLabel="t('keyMoments.settings.templates.createDrawer.code')"
        :pError="codeError"
        pRequired
      >
        <PInput
          v-model="form.code"
          :pPlaceholder="t('keyMoments.settings.templates.createDrawer.codeHint')"
          pTestId="key-moments-settings-template-code-input"
        />
      </PFormItem>

      <PFormItem
        :pLabel="t('keyMoments.settings.templates.createDrawer.label')"
        pRequired
      >
        <PInput
          v-model="form.label"
          pTestId="key-moments-settings-template-label-input"
        />
      </PFormItem>
    </PForm>

    <template #footer>
      <PDrawerActions
        :pSecondaryCTA="{
          pLabel: t('keyMoments.settings.templates.createDrawer.cancel'),
          pTestId: 'key-moments-settings-template-cancel-button',
        }"
        :pPrimaryCTA="{
          pLabel: t('keyMoments.settings.templates.createDrawer.create'),
          pLoading: isSaving,
          pDisabled: isIncomplete,
          pTestId: 'key-moments-settings-template-create-button',
        }"
        @click-secondary-cta="close"
        @click-primary-cta="save"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PDrawerActions, PForm, PFormItem, PInput } from '@pulse/styleguide/components'
import { useTemplateCreateDrawer } from './template-create-drawer.composable'
import type { TemplateCatalogueItem } from '@key-moments/services/template-editor.service.types'

const emit = defineEmits<{
  created: [item: TemplateCatalogueItem]
}>()

const { t } = useI18n()

const {
  isOpen,
  form,
  isSaving,
  codeError,
  isDuplicate,
  openNew,
  openDuplicate,
  close,
  save,
} = useTemplateCreateDrawer({ onCreated: item => emit('created', item) })

const drawerTitle = computed(() => (isDuplicate.value
  ? t('keyMoments.settings.templates.createDrawer.titleDuplicate')
  : t('keyMoments.settings.templates.createDrawer.titleNew')))

const isIncomplete = computed(() => form.code === '' || form.label === '')

// the page opens the drawer on one gesture or the other
defineExpose({ openNew, openDuplicate })
</script>
