<template>
  <PDrawer
    v-model="isOpen"
    :pTitle="title"
    pSize="480px"
    pTestId="key-moments-settings-screen-drawer"
    @close-drawer-button="cancel"
  >
    <PForm>
      <PFormItem
        :pLabel="t('keyMoments.settings.screenDrawer.title')"
        :pError="draftError"
      >
        <PInput
          :modelValue="title"
          pSize="small"
          pTestId="key-moments-settings-screen-title-input"
          @update:model-value="(value: string | number) => rename(String(value))"
        />
      </PFormItem>

      <PFormItem :pLabel="t('keyMoments.settings.screenDrawer.subtitle')">
        <PInput
          :modelValue="subtitle"
          pSize="small"
          pTestId="key-moments-settings-screen-subtitle-input"
          @update:model-value="(value: string | number) => setSubtitle(String(value))"
        />
      </PFormItem>

      <PFormItem
        :pLabel="t('keyMoments.settings.screenDrawer.id')"
        :pError="draftIdError"
      >
        <PInput
          :modelValue="id"
          pSize="small"
          :pReadonly="areIdsEditable === false"
          pTestId="key-moments-settings-screen-id-input"
          @update:model-value="(value: string | number) => setId(String(value))"
          @change="() => normalizeId()"
        />
      </PFormItem>
    </PForm>

    <template #footer>
      <PDrawerActions
        :pSecondaryCTA="{
          pLabel: t('keyMoments.settings.drawerActions.cancel'),
          pTestId: 'key-moments-settings-screen-drawer-cancel-button',
        }"
        :pPrimaryCTA="{
          pLabel: t('keyMoments.settings.drawerActions.save'),
          pDisabled: draftIdError !== undefined || draftError !== undefined,
          pTestId: 'key-moments-settings-screen-drawer-save-button',
        }"
        @click-secondary-cta="cancel"
        @click-primary-cta="save"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PDrawer, PDrawerActions, PForm, PFormItem, PInput } from '@pulse/styleguide/components'
import { useScreenDrawer } from './screen-drawer.composable'

const { t } = useI18n()

const {
  isOpen,
  title,
  subtitle,
  id,
  draftIdError,
  draftError,
  areIdsEditable,
  cancel,
  save,
  rename,
  setSubtitle,
  setId,
  normalizeId,
} = useScreenDrawer()
</script>
