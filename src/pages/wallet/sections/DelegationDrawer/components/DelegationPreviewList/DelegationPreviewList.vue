<template>
  <PBlockHeader
    class="margin-bottom--6"
    pSize="big"
    pColor="persian"
    :pTitle="t('headerBlock.title')"
    :pDescription="t('headerBlock.description')"
    :pHasButton="false"
    :pImage="{
      pFit: 'default',
      pType: 'portrait',
      pName: 'delegation'
    }"
  />
  <PTable
    ref="delegateList"
    style="width: 100%"
    :pData="delegationsList"
  >
    <PTableColumn
      pMinWidth="266"
      pSortable
      :pLabel="t('table.header.collabName')"
      :pSortMethod="sortMethodsDoubleText"
    >
      <template #default="scope">
        <PDoubleText
          pType="primary"
          :pProfile="
            getInitials(
              scope.row.delegate.firstName,
              scope.row.delegate.lastName
            )
          "
          :pTitle="
            scope.row.delegate.firstName + ' ' + scope.row.delegate.lastName
          "
          :pContent="scope.row.delegate.email"
        >
        </PDoubleText>
      </template>
    </PTableColumn>
    <PTableColumn
      pMinWidth="282"
      :pLabel="t('table.header.enableAutomaticDeligation')"
    >
      <template #default="scope">
        <PCheckbox v-model="scope.row.isAutoDelegation">
          {{ t('table.header.enableAutomaticDeligation') }}
        </PCheckbox>
      </template>
    </PTableColumn>
  </PTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type {
  DelegationPreviewListProps,
} from './DelegationPreviewListTypes.ts'
import {
  PBlockHeader,
  PTable,
  PTableColumn,
  PDoubleText,
  PCheckbox,
} from '@kpmg/styleguide'
import { getInitials } from '@/helper'

// Definitions
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<DelegationPreviewListProps>()

const delegationsList = ref(props.delegationDetails)

// Behaviours
const sortMethodsDoubleText = (a: any, b: any) => a.firstName - b.firstName

</script>

<i18n lang="json">
{
  "fr-FR": {
    "headerBlock": {
      "title": "Délégation automatique",
      "description":
      "Les nouveaux dossiers de votre portefeuille seront automatiquement synchronisés chez vos délégataires."
    },
    "table": {
      "header": {
        "collabName": "Nom du collaborateur",
        "enableAutomaticDeligation": "Activer la délégation automatique"
      }
    }
  },
  "en-US": {
    "headerBlock": {
      "title": "Délégation automatique",
      "description":
      "Les nouveaux dossiers de votre portefeuille seront automatiquement synchronisés chez vos délégataires."
    },
    "table": {
      "header": {
        "collabName": "Nom du collaborateur",
        "enableAutomaticDeligation": "Activer la délégation automatique"
      }
    }
  }
}
</i18n>
