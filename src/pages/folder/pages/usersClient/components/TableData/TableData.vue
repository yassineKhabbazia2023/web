<template>
  <div>
    <PTable
      :pData="data"
      showOverflowTooltip
      pStripe
      tableLayout="fixed"
    >
      <PTableColumn
        :pLabel="t('user')"
        pProp="initials"
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
              <p
                class="text-capitalize"
                :class="{
                  'font-bold': scope.row.isSignatory,
                }"
              >
                <span v-if="scope.row.isLoggedUser">{{ t('you') }}</span>
                <span v-if="!scope.row.isLoggedUser">
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
        :pLabel="t('dateAdded')"
        pProp="creationDate"
        pSortable
      >
        <template #default="scope">
          {{ d(scope.row.creationDate, 'short')}}
        </template>
      </PTableColumn>

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
  PIThreeDots,
  PTable,
  PTableColumn,
  PToolbox,
} from '@kpmg/styleguide'
import type { PToolboxItemProps } from '@kpmg/styleguide'
import { computed, reactive } from 'vue'
import { userPermissions } from '@kpmg/common'
import type { Props } from './types'
import { MENU_ACTIONS_NAME } from './constants'
import { PERMISSION_CODES, DATE_TIME_FORMATS as datetimeFormats } from '@/constants'
import type { IExtendedUser } from '../../types'
import { userActions } from './types'

const { d, t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const props = defineProps<Props>()
const { hasPermission } = userPermissions()
const emits = defineEmits<{
  'click-view-information': [number]
  'display-manage-rights': [number]
  'remove-user': [IExtendedUser]
}>()

const {
  deleteUser,
  modifyRights,
  removeUser,
  userInformation,
} = MENU_ACTIONS_NAME
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
      display: hasPermission(PERMISSION_CODES.MODIFY_RIGHTS_USER) && props.isInAnEntityPage,
    },
    {
      pIconName: 'PIPersonRemove',
      pValue: t('removeUser'),
      pActionName: removeUser,
      pState: 'default',
      display: hasPermission(PERMISSION_CODES.DELETE_USER) && props.isInAnEntityPage,
    },
    {
      // this item will be handle soon
      pIconName: 'PITrash',
      pValue: t('deleteUser'),
      pActionName: deleteUser,
      pState: 'danger',
      display: hasPermission(PERMISSION_CODES.DELETE_USER) && !props.isInAnEntityPage,
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
  }
  if (action === userActions.REMOVE_USER) {
    emits('remove-user', row)
  }
  if (action === userActions.USER_INFORMATION) {
    emits('click-view-information', row.contactId)
  }
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
  dateAdded: 'Date added'
  options: 'Options'
  userInformation: 'User information'
  modifyRights: 'Modify rights'
  removeUser: 'Remove User'
  deleteUser: 'Delete User'
  you: 'You'
fr-FR:
  user: 'Utilisateur'
  email: 'E-Mail'
  dateAdded: "Date d'ajout"
  options: 'Options'
  userInformation: "Informations de l'utilisateur"
  modifyRights: 'Modifier les droits'
  removeUser: "Retirer l'utilisateur"
  deleteUser: "Supprimer l'utilisateur"
  you: 'Vous'
</i18n>
