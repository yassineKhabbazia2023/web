<template>
  <PCollapse>
    <PCollapseItem pType="gray" :pTitleCollapseItem="t('selectedFolders')">
      <PTable :pData="folders">
        <PTableColumn
          :pLabel="t('folderName')"
          pProp="name"
          pSortable
        >
          <template #default="scope">
            <div class="flex align--items-center">
              <PAvatar
                :pColor="scope.row.owner.avatarColor"
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
    </PCollapseItem>
  </PCollapse>
</template>

<script setup lang="ts">
import { PCollapse, PCollapseItem, PTable, PTableColumn, PAvatar, PIcon, PIPulse } from '@kpmg/styleguide'
import { useI18n } from 'vue-i18n'
import type { CollapsableFoldersListProps } from './CollapsableFoldersListTypes'

defineProps<CollapsableFoldersListProps>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

</script>

<i18n lang="yaml">
  en-US:
    selectedFolders: 'Selected Folders'
    folderName: 'Folder'
    IBSCode: 'IBS Code'
  fr-FR:
    selectedFolders: 'Dossiers sélectionnés'
    folderName: 'Dossier'
    IBSCode: 'Code IBS'
</i18n>
