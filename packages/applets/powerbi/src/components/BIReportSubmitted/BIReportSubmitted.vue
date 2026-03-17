<template>
  <div class="text-center success-upload-pbi">
    <p class="margin-bottom--6" data-testid="powerbi-upload-successful-text">
      {{ t('successText') }}
      <span class="font-bold">{{ accountLabel }}</span>
    </p>
    <PButton
      pType="primary"
      pPlain
      pSize="default"
      data-testid="powerbi-submit-new-report-button"
      @click="emit('submit-new-report')"
    >
      {{ t('uploadNewReport') }}
    </PButton>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { PButton } from '@pulse/styleguide/components'
import type { BIReportSubmittedProps } from './bi-report-submitted.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      successText: 'The BI report has been successfully submitted to ',
      uploadNewReport: 'Upload a new report',
    },
    'fr-FR': {
      successText: 'Le rapport BI a été déposé avec succès chez ',
      uploadNewReport: 'Déposer un nouveau rapport',
    },
  },
})

defineProps<BIReportSubmittedProps>()
const emit = defineEmits<{
  'submit-new-report': []
}>()
</script>

<style lang="scss" scoped>
.success-upload-pbi {
  margin-top: 6.4rem;
  &__img {
    height: 300px;
  }
}
</style>

