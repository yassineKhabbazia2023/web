<template>
  <PEntityHeader
    :pLegalName
    :pAccountNumber
    class="margin-bottom--4"
  />
  <AccountingHeader
    v-if="hideAccountingHeader === false"
    @close="onClickCloseAccountingHeader"
  />
  <PTabs
    :modelValue="currentTabName"
    pSmartWidth
    @tab-click="onTabClick"
  >
    <PTabPane
      v-for="tab in tabs"
      :key="tab.name"
      :label="tab.label"
      :name="tab.name"
    />
  </PTabs>

  <RouterView />
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { useCurrentEntityStore } from '@pulse/common/stores'
import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'
import { APICallStatus, RouteName } from '@pulse/common/enums'
import { logger } from '@pulse/toolbox'
import { getFormattedPennylaneDocuments } from '@pennylane/helpers/pennylane-documents.helper'
import { PTabs, PTabPane, PEntityHeader } from '@pulse/styleguide/components'
import { AccountingTab } from './accounting.page.enum'
import AccountingHeader from '@pennylane/components/accounting-header/accounting-header.vue'
import { useRouter } from 'vue-router'
import { persistHideAccountingHeader, getHideAccountingHeader } from './accounting.helper'
import { PennylanePermissionsManager } from '@pulse/common/managers'

const router = useRouter()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const currentEntityStore = useCurrentEntityStore()

const pennylaneDocuments = ref<FormattedPennylaneDocument[]>([])
const apiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)

const accountId = computed(() => currentEntityStore.currentEntityId ?? 0)
const pLegalName = computed(() => currentEntityStore.currentEntity?.legalName ?? '')
const pAccountNumber = computed(() => currentEntityStore.currentEntityAccountNumber)

const tabs: {
  name: AccountingTab
  label: string
  routeName: RouteName
}[] = []

if (PennylanePermissionsManager.hasPennylaneAccountingGedV2Permission() === true) {
  tabs.push({
    name: AccountingTab.GED_V2,
    label: t('tabs.ged-v2'),
    routeName: RouteName.PENNYLANE_GED_V2,
  })
}
if (PennylanePermissionsManager.hasPennylaneAccountingGedLegacyPermission() === true) {
  tabs.push({
    name: AccountingTab.GED_LEGACY,
    label: t('tabs.ged-legacy'),
    routeName: RouteName.PENNYLANE_GED_LEGACY,
  })
}

const currentTabName = computed(() => {
  if (tabs.length === 0) {
    return AccountingTab.GED_V2
  }
  const routeName = router.currentRoute.value.name
  const tab = tabs.find(tab => tab.routeName === routeName)

  return tab?.name ?? tabs[0].name
})

const hideAccountingHeader = ref(false)

function onClickCloseAccountingHeader() {
  hideAccountingHeader.value = true
  persistHideAccountingHeader(hideAccountingHeader.value)
}

onMounted(async () => {
  if (tabs.length === 0) {
    logger.error('unmanaged case')
    router.push({ name: RouteName.ERROR403 })
  }
  hideAccountingHeader.value = getHideAccountingHeader()
  const pathPrefix = 'Pennylane'
  try {
    apiCallStatus.value = APICallStatus.LOADING
    const documentQueryResult = await PennylaneService.getDocuments(pAccountNumber.value, accountId.value)

    pennylaneDocuments.value = getFormattedPennylaneDocuments(documentQueryResult.items, pathPrefix)
    apiCallStatus.value = APICallStatus.SUCCESS
  } catch (e) {
    logger.error('Error while loading pennylane documents', e)
    apiCallStatus.value = APICallStatus.ERROR
  }
})

function onTabClick(tabPane: TabsPaneContext) {
  const tabName = tabPane.props.name as AccountingTab
  const tab = tabs.find(tab => tab.name === tabName)
  if (tab !== undefined) {
    router.push({ name: tab.routeName })
  }
}
</script>

<i18n lang="yaml">
  en-US:
    tabs:
      ged-v2: 'RYDGE Conseil documents '
      ged-legacy: 'Archives'
  fr-FR:
    tabs:
      ged-v2: 'Documents RYDGE Conseil'
      ged-legacy: 'Archives'
</i18n>
