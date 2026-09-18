<template>
  <PTable
    :pData="indicators"
    pRowKey="id"
    pStripe
    :pCellStyle="getCellStyle"
    :pEmptyText="t('keyMoments.settings.indicators.empty')"
    pTestId="key-moments-settings-indicators-table"
  >
    <PTableColumn
      :pLabel="t('keyMoments.settings.indicators.columns.code')"
      pProp="id"
      pMinWidth="200px"
    />
    <PTableColumn
      :pLabel="t('keyMoments.settings.indicators.columns.label')"
      pProp="label"
      pMinWidth="220px"
    />
    <PTableColumn :pLabel="t('keyMoments.settings.indicators.columns.shortLabel')">
      <template #default="{ row }">
        {{ row.shortLabel ?? '—' }}
      </template>
    </PTableColumn>
    <PTableColumn :pLabel="t('keyMoments.settings.indicators.columns.kind')">
      <template #default="{ row }">
        {{ t(`keyMoments.settings.indicators.kinds.${row.kind}`) }}
      </template>
    </PTableColumn>
    <PTableColumn :pLabel="t('keyMoments.settings.indicators.columns.sign')">
      <template #default="{ row }">
        {{ t(`keyMoments.settings.indicators.signs.${row.sign}`) }}
      </template>
    </PTableColumn>
    <PTableColumn :pLabel="t('keyMoments.settings.indicators.columns.state')">
      <template #default="{ row }">
        <PTag
          v-if="row.isDeprecated === true"
          pColor="light-gray"
          pSize="small"
          :pContent="t('keyMoments.settings.indicators.deprecatedState')"
        />
        <span v-else>{{ t('keyMoments.settings.indicators.activeState') }}</span>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('keyMoments.settings.indicators.columns.actions')"
      pMinWidth="200px"
    >
      <template #default="{ row }">
        <div
          class="
            flex
            flex--align-items-center
            flex-gap--2
          "
        >
          <PButton
            pSize="small"
            pType="secondary"
            :pTestId="`key-moments-settings-indicator-${row.id}-edit-button`"
            @click="emit('edit', row.id)"
          >
            {{ t('keyMoments.settings.indicators.edit') }}
          </PButton>
          <PButton
            v-if="row.isDeprecated === true"
            pSize="small"
            pType="tertiary"
            :pTestId="`key-moments-settings-indicator-${row.id}-restore-button`"
            @click="emit('restore', row.id)"
          >
            {{ t('keyMoments.settings.indicators.restore') }}
          </PButton>
          <PButton
            v-else
            pSize="small"
            pType="tertiary"
            :pTestId="`key-moments-settings-indicator-${row.id}-deprecate-button`"
            @click="emit('deprecate', row.id)"
          >
            {{ t('keyMoments.settings.indicators.deprecate') }}
          </PButton>
        </div>
      </template>
    </PTableColumn>
  </PTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PTable, PTableColumn, PTag } from '@pulse/styleguide/components'
import type { CSSProperties } from 'vue'
import type { Indicator } from '../../types/key-moments.types'

defineProps<{
  indicators: Indicator[]
}>()

const emit = defineEmits<{
  edit: [code: string]
  deprecate: [code: string]
  restore: [code: string]
}>()

const { t } = useI18n()

/**
 * A deprecated term stays readable — the templates citing it still show it — so
 * the whole row is greyed rather than hidden.
 */
// the row is typed by the table, which knows nothing of what it displays
function getCellStyle({ row }: { row: Record<string, unknown> }): CSSProperties {
  if (row.isDeprecated !== true) {
    return {}
  }

  return {
    backgroundColor: 'var(--p-gray-100)',
    color: 'var(--p-gray-500)',
  }
}
</script>
