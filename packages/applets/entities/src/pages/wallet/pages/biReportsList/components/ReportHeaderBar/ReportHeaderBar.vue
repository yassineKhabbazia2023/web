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
      <span>{{ t('viewError') }}</span>
      <PPastille
        v-if="errorsData.totalItems > 0"
        pType="warning"
        class="margin-left--3"
      >
        {{ errorsData.totalItems }}
      </PPastille>
    </PButton>
  </div>
  <ReportErrorDrawer
    v-model="isErrorDrawerOpened"
    :errors="errorsData.errors"
  />
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import {
  PButton,
  PPastille,
} from '@pulse/styleguide/components'
import { ErrorReportData } from '../../types/report-error.type'
import ReportErrorDrawer from '../../components/ReportErrorDrawer'
import { useI18n } from 'vue-i18n'
import { fetchReportErrors } from '@entities/services/reporting/reportingServices'
import { displayNotification } from '@entities/common/utils'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const errorsData = reactive<ErrorReportData>({
  errors: [],
  totalItems: 0,
})
const isErrorDrawerOpened = ref(false)

const handleOpenErrorDrawer = () => {
  isErrorDrawerOpened.value = true
}

const fetchErrorsReportData = async () => {
  try {
    const { items, totalItems } = await fetchReportErrors()
    errorsData.errors = items
    errorsData.totalItems = totalItems
  } catch {
    displayNotification('error', t('errors.reportFetch'))
  }
}

onMounted(() => {
  fetchErrorsReportData()
})
</script>
<i18n lang="yaml">
en-US:
  viewError: 'Show errors'
fr-FR:
  viewError: 'Voir anomalies'
</i18n>
