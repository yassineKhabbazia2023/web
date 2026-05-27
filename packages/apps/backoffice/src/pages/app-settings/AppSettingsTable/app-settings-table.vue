<template>
  <PTable
    data-testid="app-settings-table"
    :pData="appSettings"
    empty-text="Aucune variable d'environnement disponible"
    class="width--100 border-radius--2"
  >
    <PTableColumn
      data-testid="app-settings-table-key-column"
      pLabel="Clé"
      pWidth="330px"
      fixed="left"
    >
      <template #default="{ row: { key } }">
        <PTooltip
          :pContent="key"
          pPlacement="top"
        >
          <PTag
            pSize="default"
            pColor="gray"
            pRound
            :pContent="key"
            class="app-settings-table__key-tag"
          />
        </PTooltip>
      </template>
    </PTableColumn>
    <PTableColumn
      data-testid="app-settings-table-domain-column"
      pLabel="Domaine"
      pWidth="180px"
    >
      <template #default="{ row: { domain } }">
        <PTag
          pSize="default"
          pColor="info"
          pRound
          :pContent="domain"
        />
      </template>
    </PTableColumn>
    <PTableColumn
      v-for="envLabel in envLabels"
      :key="envLabel"
      :data-testid="`app-settings-table-env-column-${envLabel}`"
      :pLabel="envLabel"
      pMinWidth="250px"
    >
      <template #default="{ row }">
        <AppSettingValueDisplayer
          v-if="getValueForEnv(row, envLabel) !== null"
          :value="getValueForEnv(row, envLabel)!.value"
          :lastModified="getValueForEnv(row, envLabel)!.lastModified"
          :incoherent="getValueForEnv(row, envLabel)!.incoherent ?? null"
          :type="row.type"
        />
        <div v-else class="flex flex--align-items-center">
          <PTooltip
            v-if="shouldShowMissingEnvIcon(row)"
            pContent="Cette variable n'existe pas dans cet environnement"
            pPlacement="top"
          >
            <PIcon
              data-testid="app-settings-table-missing-env-icon"
              pName="exclamationTriangle"
              :color="AppColors.RED_500"
              class="margin-right--2"
              pSize="14"
            />
          </PTooltip>
          <span class="font-light font-small text-color--neutral-gray-400">-</span>
        </div>
      </template>
    </PTableColumn>
    <PTableColumn
      v-if="envLabels.length === 0"
      pLabel=" "
      pMinWidth="300px"
    >
      <template #default>
        <span />
      </template>
    </PTableColumn>
    <PTableColumn
      data-testid="app-settings-table-actions-column"
      pLabel="Actions"
      pWidth="100px"
      fixed="right"
    >
      <template #default="{ row }">
        <div class="flex flex--align-items-center flex--gap-2">
          <PTooltip pContent="Modifier la variable">
            <PButton
              data-testid="app-settings-table-edit-button"
              pSize="small"
              pIconOnly
              @click="handleOpenModifyDialog(row)"
            >
              <PIcon
                pName="pencilSquare"
                :color="AppColors.YELLOW_800"
              />
            </PButton>
          </PTooltip>


          <PTooltip pContent="Supprimer la variable">
            <PButton
              data-testid="app-settings-table-delete-button"
              pSize="small"
              pIconOnly
              @click="handleOpenDeleteDialog(row)"
            >
              <PIcon
                pName="trash"
                :color="AppColors.RED_500"
              />
            </PButton>
          </PTooltip>
        </div>
      </template>
    </PTableColumn>
  </PTable>

  <DeleteAppSettingDialog
    v-if="isDeleteDialogOpened === true && appSettingToDelete !== null"
    v-model="isDeleteDialogOpened"
    :appSettingKey="appSettingToDelete.key"
    :availableEnvironments="getAvailableEnvironments(appSettingToDelete)"
    @app-setting-deleted="handleAppSettingDeleted"
  />

  <ModifyAppSetting
    v-if="isModifyDialogOpened && appSettingToModify"
    v-model="isModifyDialogOpened"
    :appSetting="appSettingToModify"
    @app-setting-updated="handleAppSettingUpdated"
  />


  <PPagination
    v-if="appSettings.length > 0"
    v-model:p-page-size="pageSizeModel"
    data-testid="app-settings-table-pagination"
    class="margin-top--8"
    :pCurrentPage="props.currentPage"
    :pTotal="props.totalCount"
    :pPageSizes="[10, 25, 50, 100]"
    pPageSizeSelectorSuffix=""
    pShowTotalPageCounter
    @on-page-range-changed="handlePageSizeChange"
    @update:p-current-page="handlePageChange"
  >
    <p>{{ paginationLabel }}</p>
  </PPagination>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { PTag, PTableColumn, PTable, PIcon, PTooltip, PPagination, PButton } from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import { getPaginationLabel } from '@pulse/common/utils'
import type { AppSettingItem, AppSettingValue } from '@backoffice/types/app-settings-list.type'
import type { AppSettingsTableProps } from './app-settings-table.type'
import type { EnvironmentOption } from '@backoffice/types/environment-option.type'
import { shouldShowMissingEnvIcon } from './app-settings-table.utils'
import AppSettingValueDisplayer from './AppSettingValueDisplayer/app-setting-value-displayer.vue'
import DeleteAppSettingDialog from './DeleteAppSettingDialog/delete-app-setting-dialog.vue'
import ModifyAppSetting from './ModifyAppSetting/modify-app-setting.vue'

const props = defineProps<AppSettingsTableProps>()

const emit = defineEmits<{
  'page-change': [page: number]
  'page-size-change': [pageSize: number]
  'app-setting-deleted': []
  'app-setting-updated': []
}>()

const isDeleteDialogOpened = ref(false)
const appSettingToDelete = ref<AppSettingItem | null>(null)

const isModifyDialogOpened = ref(false)
const appSettingToModify = ref<AppSettingItem | null>(null)

// Extract all unique environment labels dynamically
const envLabels = computed(() => {
  const labels = new Set<string>()
  for (const item of props.appSettings) {
    for (const val of item.values) {
      labels.add(val.envLabel)
    }
  }
  return Array.from(labels).sort()
})

const getValueForEnv = (row: AppSettingItem, envLabel: string): AppSettingValue | null => {
  return row.values.find(val => val.envLabel === envLabel) ?? null
}

// Pagination
const pageSizeModel = ref(props.pageSize)

const paginationLabel = computed(() =>
  getPaginationLabel('sur', {
    currentPage: props.currentPage,
    limit: props.pageSize,
    data: props.appSettings,
    totalItems: props.totalCount,
  }),
)

const handlePageChange = (page: number) => {
  emit('page-change', page)
}

const handlePageSizeChange = (pageSize: number) => {
  pageSizeModel.value = pageSize
  emit('page-size-change', pageSize)
}

const getAvailableEnvironments = (item: AppSettingItem): EnvironmentOption[] => {
  // Group by environment and collect labels
  const groupedMap = new Map<string, Set<string>>()

  for (const val of item.values) {
    if (groupedMap.has(val.environment) === false) {
      groupedMap.set(val.environment, new Set())
    }

    if (val.envLabel !== undefined && val.envLabel !== val.environment) {
      groupedMap.get(val.environment)!.add(val.envLabel)
    }
  }

  // Convert to array of EnvironmentOption
  return Array.from(groupedMap.entries()).map(([environment, labelsSet]) => ({
    environment,
    labels: Array.from(labelsSet),
  }))
}

const handleOpenDeleteDialog = (item: AppSettingItem) => {
  appSettingToDelete.value = item
  isDeleteDialogOpened.value = true
}

const handleAppSettingDeleted = () => {
  emit('app-setting-deleted')
  appSettingToDelete.value = null
}

const handleOpenModifyDialog = (item: AppSettingItem) => {
  appSettingToModify.value = item
  isModifyDialogOpened.value = true
}

const handleAppSettingUpdated = async () => {
  emit('app-setting-updated')
  appSettingToModify.value = null
  isModifyDialogOpened.value = false
}

</script>

<style scoped lang="scss">
.app-settings-table__key-tag {
  max-width: 300px;

  :deep(.el-tag__content) {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 1px 0;
  }
}
</style>
