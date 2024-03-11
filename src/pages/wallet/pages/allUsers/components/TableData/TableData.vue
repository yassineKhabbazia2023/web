<template>
<div>
  <PTable
    :pData="props.data"
    showOverflowTooltip
    pStripe
    tableLayout="fixed"
  >
    <PTableColumn
      :pLabel="t('user')"
      pProp="user"
      pSortable
    >
      <template #default="scope">
        <div class="flex flex--align-items-center">
          <PAvatar
            class="margin-right--2"
            pColor="bordered-persian"
            pType="xsmall"
          >
            {{ scope.row.initials }}
          </PAvatar>
          <div>
            <p class="line-height--120 text-capitalize">
              <span v-if="scope.row.isLoggedUser()">{{ t('you') }}</span>
              <span v-if="!scope.row.isLoggedUser()">
                {{ scope.row.firstName }}
                <span class="text-uppercase"> {{ scope.row.lastName }}</span>
              </span>
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
      :pLabel="t('role')"
      pProp="persona"
      pSortable
    >
      <template #default="scope">
        <div
          v-if="scope.row.isOwner"
          class="flex flex--align-items-center"
        >
          <PIcon color="#5546FF">
            <PIPatchCheck />
          </PIcon>

          <p class="margin-left--2 color-persian font-bold">
            {{ scope.row.persona }}
          </p>
        </div>

        <div v-if="!scope.row.isOwner">
          {{ scope.row.persona }}
        </div>
      </template>
    </PTableColumn>

    <PTableColumn
      :pLabel="t('dateAdded')"
      pProp="createdAt"
      pSortable
    />

    <PTableColumn
      :pLabel="t('options')"
      :pWidth="100"
      pProp="options"
    >
      <template #default="scope">
        <PToolbox
          @p-toolbox-item-clicked="$event => handleToolboxItemClick($event, scope.row)"
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
      </template>
    </PTableColumn>
  </PTable>
</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  PAvatar,
  PButton,
  PIcon,
  PIPatchCheck,
  PIThreeDots,
  PTable,
  PTableColumn,
  PToolbox
} from '@kpmg/styleguide'
import type { PToolboxItemProps } from '@kpmg/styleguide'
import { reactive } from 'vue'
import type { Props } from './types'
import { MENU_ACTIONS_NAME } from './constants'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const props = defineProps<Props>()

const { userInformation, modifyRights, deleteUser } = MENU_ACTIONS_NAME
const menuElements : PToolboxItemProps[] = [
  {
    pIconName: 'PIPerson',
    pValue: t('userInformation'),
    pActionName: userInformation,
    pState: 'default'
  },
  {
    pIconName: 'PIPencilSquare',
    pValue: t('modifyRights'),
    pActionName: modifyRights,
    pState: 'default'
  },
  {
    pIconName: 'PITrash',
    pValue: t('deleteUser'),
    pActionName: deleteUser,
    pState: 'default'
  }
]

const state = reactive({
  rowData: undefined
})

const handleToolboxItemClick = (_action: string, row: any) => {
  state.rowData = row
}
</script>

<style lang="scss" scoped>
.color-persian {
  color: var(--el-color-base-persian);
}

.line-height--120 {
  line-height: 120%;
}
</style>

<i18n lang="yaml">
en-US:
  user: 'User'
  email: 'Email'
  role: 'Role'
  dateAdded: 'Date added'
  options: 'Options'
  userInformation: 'User information'
  modifyRights: 'Modify rights'
  deleteUser: 'Delete User'
  you: 'You'
fr-FR:
  user: 'Utilisateur'
  email: 'E-Mail'
  role: 'Fonction'
  dateAdded: "Date d'ajout"
  options: 'Options'
  userInformation: "Informations de l’utilisateur"
  modifyRights: 'Modifier les droits'
  deleteUser: "Supprimer l’utilisateur"
  you: 'Vous'
</i18n>
