<template>
  <div
    class="
      flex
      flex--align-items-center
      flex--justify-content-flex-end
      margin-bottom--6
      "
  >
    <PButton
      pType="secondary"
      pSize="small"
      pPlain
      @click="handleOpenErrorDrawer"
    >
      <span>{{ t('showErrors') }}</span>
      <PPastille
        v-if="reportErrorsData.totalItems > 0"
        pType="warning"
        class="margin-left--3"
      >
        {{ reportErrorsData.totalItems }}
      </PPastille>
    </PButton>
  </div>
  <ReportErrorDrawer
    v-model="isErrorDrawerOpened"
    :reportErrors="reportErrorsData.errors"
  />
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PButton,
  PPastille,
} from '@pulse/styleguide/components'
import { ReportErrorData } from '@entities/common/types/BIReportsTypes'
import ReportErrorDrawer from '../../components/ReportErrorDrawer'
import { fetchReportErrors } from '@entities/services/reporting/reportingServices'
import { displayNotification } from '@entities/common/utils'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const isErrorDrawerOpened = ref(false)
const reportErrorsData = reactive<ReportErrorData>({
  errors: [],
  totalItems: 0,
})

const handleOpenErrorDrawer = () => {
  isErrorDrawerOpened.value = true
}

const fetchReportErrorsData = async () => {
  try {
    const { items, totalItems } = await fetchReportErrors()
    reportErrorsData.errors = items
    reportErrorsData.totalItems = totalItems
  } catch {
    displayNotification('error', t('errors.reportFetch'))
  }
}

onMounted(() => {
  fetchReportErrorsData()
})
</script>
<i18n lang="yaml">
  en-US:
    showErrors: 'Show errors'
    errors:
      reportErrorsFetch: >
        We couldn't load the report errors. Please check your connection or try again shortly.
  fr-FR:
    showErrors: 'Voir anomalies'
    errors:
      reportErrorsFetch: >
        Nous n'avons pas pu charger les erreurs de rapport.
        Veuillez vérifier votre connexion ou réessayer dans un instant.
</i18n>
