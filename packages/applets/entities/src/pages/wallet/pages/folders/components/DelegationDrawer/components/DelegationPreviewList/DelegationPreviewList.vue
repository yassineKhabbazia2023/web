<template>
  <PBlockHeader
    class="margin-bottom--6"
    pSize="big"
    pColor="persian"
    :pTitle="t('headerBlock.title')"
    :pDescription="t('headerBlock.description')"
    :pHasButton="false"
    :pImage="{
      pFit: 'fill',
      pName: 'person-delegation-duotone',
    }"
  />
  <PTable
    ref="delegateList"
    style="width: 100%"
    :pData="delegationsList"
    pStripe
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
          :pAvatarRole="AvatarRoles.COLLAB"
        />
      </template>
    </PTableColumn>
    <PTableColumn
      pMinWidth="282"
      :pLabel="t('table.header.enableAutomaticDelegation')"
    >
      <template #header>
        <PCheckbox
          v-model="hasAllAutomaticDelegationSelected"
          @change="handleToggleAllAutomaticDelegation"
        >
          <span class="text-color--neutral-gray-300">{{ t('table.header.enableAutomaticDelegation') }}</span>
        </PCheckbox>
      </template>

      <template #default="scope">
        <PCheckbox v-model="scope.row.isAutomaticDelegation">
          {{ t('table.header.enableAutomaticDelegation') }}
        </PCheckbox>
      </template>
    </PTableColumn>
  </PTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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
} from '@pulse/styleguide/components'
import { AvatarRoles } from '@pulse/styleguide'
import { getInitials } from '@entities/helper'

// Definitions
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<DelegationPreviewListProps>()
const emit = defineEmits<{
  'update:modelValue': [DelegationPreviewListProps['modelValue']]
}>()

const delegationsList = computed({
  get() {
    return props.modelValue
  },
  set(value: DelegationPreviewListProps['modelValue']) {
    emit('update:modelValue', value)
  },
})

const hasAllAutomaticDelegationSelected = ref(false)

// Behaviours
const sortMethodsDoubleText = (a: any, b: any) => a.firstName - b.firstName

const handleToggleAllAutomaticDelegation = () => {
  delegationsList.value.forEach(delegationsListItem => {
    delegationsListItem.isAutomaticDelegation = hasAllAutomaticDelegationSelected.value
  })
}
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
        "enableAutomaticDelegation": "Activer la délégation automatique"
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
        "enableAutomaticDelegation": "Activer la délégation automatique"
      }
    }
  }
}
</i18n>
