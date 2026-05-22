<template>
  <PTable :pData="folders">
    <PTableColumn
      :pLabel="t('folderName')"
      pProp="name"
      pSortable
    >
      <template #default="scope">
        <div class="flex align--items-center">
          <PEntityAvatar
            pAccountType="REGULAR"
            :pColor="scope.row.avatarColor"
            pType="xsmall"
          />
          <p class="font-semibold margin-left--2">
            {{ scope.row.name }}
          </p>
        </div>
      </template>
    </PTableColumn>

    <PTableColumn
      :pLabel="t('IBSCode')"
      pProp="accountNumber"
    />
  </PTable>
</template>

<script lang="ts" setup>
import { PTable, PTableColumn, PEntityAvatar } from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'
import type { SelectedFoldersListProps } from './SelectedFoldersListTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      folderName: 'Folder',
      IBSCode: 'Customer Code',
    },
    'fr-FR': {
      folderName: 'Dossier',
      IBSCode: 'Code Client',
    },
  },
})

defineProps<SelectedFoldersListProps>()
</script>

