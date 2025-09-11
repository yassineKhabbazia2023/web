<template>
  <EntityHeader
    :accountName
    :accountNumber
    class="margin-bottom--4"
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
import { useSelectedEntityStore } from '@pulse/common/stores'
import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'
import { APICallStatus, CustomerPermission, CollaboratorPermission, RouteName } from '@pulse/common/enums'
import { logger } from '@pulse/core'
import { getFormattedPennylaneDocuments } from '@pennylane/helpers/pennylane-documents.helper'
import { PTabs, PTabPane } from '@pulse/styleguide/components'
import { AccountingTab } from './accounting.page.enum'
import EntityHeader from '@pennylane/components/entity-header/entity-header.vue'
import { APP_ROUTES, ACCOUNT_PERMISSIONS } from '@pulse/common/constants'
import { useRouter } from 'vue-router'
import { CurrentUserManager } from '@pulse/common/managers'

const router = useRouter()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const selectedEntityStore = useSelectedEntityStore()

const pennylaneDocuments = ref<FormattedPennylaneDocument[]>([])
const apiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)

const accountId = computed(() => selectedEntityStore.selectedEntityId ?? 0)
const accountName = computed(() => selectedEntityStore.selectedEntity?.legalName ?? '')
const accountNumber = computed(() => selectedEntityStore.selectedEntityAccountNumber)

const tabs: {
  name: AccountingTab
  label: string
  routeName: RouteName
}[] = []

const gedLegacyRequiredPermissions = [
  CollaboratorPermission.ACCEDER_GED_COMPTABLE,
  CustomerPermission.ACCEDER_GED_COMPTABLE,
]
if (CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.PENNYLANE_ACCOUNTING_V2) === true) {
  tabs.push({
    name: AccountingTab.GED_PENNYLANE,
    label: t('tabs.ged-pennylane'),
    routeName: APP_ROUTES.entity.pennylaneAccounting.gedV2.name,
  })
}
if (CurrentUserManager.hasPermission(gedLegacyRequiredPermissions) === true) {
  tabs.push({
    name: AccountingTab.GED_LEGACY,
    label: t('tabs.ged-legacy'),
    routeName: APP_ROUTES.entity.pennylaneAccounting.gedLegacy.name,
  })
}

const currentTabName = computed(() => {
  if (tabs.length === 0) {
    return AccountingTab.GED_PENNYLANE
  }
  const routeName = router.currentRoute.value.name
  const tab = tabs.find(tab => tab.routeName === routeName)

  return tab?.name ?? tabs[0].name
})

onMounted(async () => {
  if (tabs.length === 0) {
    logger.error('unmanaged case')
    router.push({ name: RouteName.ERROR403 })
  }
  const pathPrefix = 'Pennylane'
  try {
    apiCallStatus.value = APICallStatus.LOADING
    const documentQueryResult = await PennylaneService.getDocuments(accountNumber.value, accountId.value)

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
      ged-pennylane: 'RYDGE Conseil documents '
      ged-legacy: 'Archives'
  fr-FR:
    tabs:
      ged-pennylane: 'Documents RYDGE Conseil'
      ged-legacy: 'Archives'
</i18n>
