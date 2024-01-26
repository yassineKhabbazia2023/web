<template>
<PTable
  :pData="props.data"
  highlightCurrentRow
  showOverflowTooltip
  pStripe
  tableLayout="fixed"
  class="collaborator-table"
>
  <PTableColumn
    :pLabel="t('nameOfCollaborator')"
    pProp="lastName"
    pSortable
  >
    <template #default="scope">
      <div class="flex flex--align-items-center">
        <PAvatar
          class="margin-right--2"
          pColor="persian-gradient"
          pType="xsmall"
        >
          {{ scope.row.initials }}
        </PAvatar>
        <div>
          <p class="line-height--120 font-semibold">
            <span class="text-capitalize">{{ scope.row.firstName }}</span>
            <span class="text-uppercase margin-left--1">{{ scope.row.lastName }}</span>
          </p>
        </div>
      </div>
    </template>
  </PTableColumn>

  <PTableColumn
    :pLabel="t('email')"
    pProp="email"
    pSortable
  />

  <PTableColumn
    :pLabel="t('phoneNumber')"
    pProp="phoneNumber"
    pSortable
  />

  <PTableColumn
    :pLabel="t('ibsStatus')"
    pProp="ibsStatus"
    pSortable
  />

  <PTableColumn
    :pLabel="t('role')"
    pProp="role"
    pSortable
  />

  <PTableColumn
    :pLabel="t('office')"
    pProp="office"
    pSortable
  />

  <PTableColumn
    :pLabel="t('access')"
    pProp="access"
    pSortable
  >
    <template #default="scope">
      <PSwitch
        :modelValue="accessState[scope.row.id]"
        @update:modelValue="(val) => accessState[scope.row.id] = val"
      />
    </template>
  </PTableColumn>

  <PTableColumn
    :pLabel="t('options')"
    :pWidth="100"
    pProp="options"
  >
    <PToolbox
      trigger="click"
      :pElements="menuElements"
    >
      <PButton
        pType="generic"
        pSize="small"
        class="margin-left--1"
      >
        <PIcon>
          <PIThreeDots />
        </PIcon>
      </PButton>
    </PToolbox>
  </PTableColumn>
</PTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  PAvatar,
  PButton,
  PIcon,
  PIThreeDots,
  PSwitch,
  PTable,
  PTableColumn,
  PToolbox
} from '@kpmg/styleguide'
import type { PToolboxItemProps } from '@kpmg/styleguide'
import { reactive } from 'vue'
import type { Props } from './types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const props = withDefaults(defineProps<Props>(), {
  data: []
})

const access = props.data.map(({ id, hasAccess }: { id: string, hasAccess: boolean }) => ({
  [id]: hasAccess
}))
const accessState = reactive(Object.assign({}, ...access))

const menuElements : PToolboxItemProps[] = [
  {
    pIconName: 'PIPerson',
    pValue: t('informationsAboutCollaborator'),
    pActionName: 'informationsAboutCollaborator',
    pState: 'default'
  },
  {
    pIconName: 'PIClipboardData',
    pValue: t('detailsOfDelegations'),
    pActionName: 'detailsOfDelegations',
    pState: 'default'
  },
  {
    pIconName: 'PIGrid',
    pValue: t('manageAccessRights'),
    pActionName: 'manageAccessRights',
    pState: 'default'
  }
]
</script>

<style lang="scss" scoped>
.color-gray--500 {
  color: var(--el-color-neutral-gray-500);
}

.line-height--120 {
  line-height: 120%;
}
</style>

<i18n lang="yaml">
en-US:
  nameOfCollaborator: 'Name of collaborator'
  email: 'Email'
  phoneNumber: 'Phone number'
  ibsStatus: 'IBS Status'
  role: 'Role'
  office: 'Office'
  access: 'Access'
  options: 'Options'
  informationsAboutCollaborator: 'Collaborator information'
  detailsOfDelegations: 'Details of delegations'
  manageAccessRights: 'Manage access rights'
fr-FR:
  nameOfCollaborator: 'Nom du collaborateur'
  email: 'Mail'
  phoneNumber: 'Téléphone'
  ibsStatus: 'Status IBS'
  role: 'Rôle'
  office: 'Bureau'
  access: 'Accès'
  options: 'Options'
  informationsAboutCollaborator: 'Informations du collaborateur'
  detailsOfDelegations: 'Détails des délégations'
  manageAccessRights: "Gérer les droits d’accès"
</i18n>
