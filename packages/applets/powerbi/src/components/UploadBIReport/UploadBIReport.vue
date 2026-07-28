<template>
  <PFormItem>
    <template #label>
      <span class="flex">
        {{ t('uploadReport') }}
        <PIcon
          :color="AppColors.GRAY_300"
          class="margin-left--2"
          pName="patchCheck"
        />
      </span>
    </template>
    <PUpload
      v-model="reportFile"
      :pPrefixLabelFileLine="t('prefixLabelFileLine')"
      :pSuffixLabelFileLine="t('suffixLabelFileLine')"
      :pDeleteButtonTitle="t('deleteButtonTitle')"
      pAuthorizedFileFormat="PBX"
      pTextLimitSize="50 Mo"
    />
  </PFormItem>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PFormItem, PUpload, PIcon } from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      uploadReport: 'Please file BI report',
      prefixLabelFileLine: 'Drag file or',
      suffixLabelFileLine: 'browse computer',
      deleteButtonTitle: 'Delete document',
    },
    'fr-FR': {
      uploadReport: 'Veuillez déposer le rapport BI',
      prefixLabelFileLine: 'Glisser le fichier ou',
      suffixLabelFileLine: 'parcourir l\'ordinateur',
      deleteButtonTitle: 'Supprimer le document',
    },
  },
})

const reportFile = defineModel<File | null>({ default: null })
</script>
