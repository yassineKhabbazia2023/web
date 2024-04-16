<template>
  <PTable :pData="folders">
    <PTableColumn
      :pLabel="t('folderName')"
      pProp="name"
      pSortable
    >
      <template #default="scope">
        <div class="flex align--items-center">
          <PAvatar
            :pColor="scope.row.avatarColor"
            pType="xsmall"
          >
            <PIcon>
              <PIPulse />
            </PIcon>
          </PAvatar>
          <p class="font-semibold margin-left--2">
            {{ scope.row.name }}
          </p>
        </div>
      </template>
    </PTableColumn>

    <PTableColumn
      :pLabel="t('IBSCode')"
      pProp="name"
    />
  </PTable>
</template>

<script lang="ts" setup>
import { PTable, PTableColumn, PAvatar, PIcon, PIPulse } from '@kpmg/styleguide'
import { useI18n } from 'vue-i18n'
import type { SelectedFoldersListProps } from './SelectedFoldersListTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineProps<SelectedFoldersListProps>()
</script>

<i18n lang="yaml">
  en-US:
    folderName: 'Folder'
    IBSCode: 'IBS Code'
  fr-FR:
    folderName: 'Dossier'
    IBSCode: 'Code IBS'
</i18n>
