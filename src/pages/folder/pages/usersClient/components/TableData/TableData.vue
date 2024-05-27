<template>
  <div>
    <PTable
      :pData="props.data"
      showOverflowTooltip
      pStripe
      tableLayout="fixed"
      @sort-change="handleSortChange"
    >
      <PTableColumn
        :pLabel="t('user')"
        pProp="user"
        pSortable
      >
        <template #default="scope">
          <div class="flex flex--align-items-center">
            <div class="margin-right--2">
              <PAvatar
                pColor="bordered-persian"
                pType="xsmall"
              >
                {{ scope.row.initials }}
              </PAvatar>
            </div>
            <div>
              <p class="text-capitalize">
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
        pProp="personaName"
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
              {{ scope.row.personaName }}
            </p>
          </div>

          <p
            v-if="!scope.row.isOwner"
            class="font-bold"
          >
            {{ scope.row.personaName}}
          </p>
        </template>
      </PTableColumn>

      <PTableColumn
        :pLabel="t('dateAdded')"
        pProp="creationDate"
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
  PToolbox,
} from '@kpmg/styleguide'
import type { PToolboxItemProps } from '@kpmg/styleguide'
import { reactive, computed } from 'vue'
import { userPermissions } from '@kpmg/common'
import type { Props } from './types'
import { MENU_ACTIONS_NAME } from './constants'
import { PERMISSION_CODES } from '@/constants'
import { returnSortQueryField } from '@/helper'
import type { IExtendedUser } from '../../types'
import { userActions } from './types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<Props>()
const { hasPermission } = userPermissions()
const emits = defineEmits<{
  'click-view-information': [number]
  'display-manage-rights': [number]
}>()

const { userInformation, modifyRights, deleteUser } = MENU_ACTIONS_NAME
const menuElements = computed<PToolboxItemProps[]>(() =>
  [
    {
      pIconName: 'PIPerson',
      pValue: t('userInformation'),
      pActionName: userInformation,
      pState: 'default',
      display: true,
    },
    {
      pIconName: 'PIPencilSquare',
      pValue: t('modifyRights'),
      pActionName: modifyRights,
      pState: 'default',
      display: hasPermission(PERMISSION_CODES.MODIFY_RIGHTS_USER),
    },
    {
      pIconName: 'PITrash',
      pValue: t('deleteUser'),
      pActionName: deleteUser,
      pState: 'default',
      display: hasPermission(PERMISSION_CODES.DELETE_USER),
    },
  ]
    .filter(({ display }) => display)
    .map(({ pIconName, pValue, pActionName, pState }) => ({
      pIconName,
      pValue,
      pActionName,
      pState,
    })) as PToolboxItemProps[],
)

const state = reactive({
  rowData: {} as IExtendedUser,
})

const handleToolboxItemClick = (action: string, row: any) => {
  state.rowData = row
  if (action === userActions.MODIFY_RIGHTS) {
    emits('display-manage-rights', row.contactId)
  } else {
    emits('click-view-information', row.contactId)
  }
}

const handleSortChange = (data:any) => {
  const columnLabel = data.prop
  const order = data.order
  returnSortQueryField(columnLabel, order)
}
</script>

<style lang="scss" scoped>
.color-persian {
  color: var(--el-color-base-persian);
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
