<template>
  <div>
    <PTable
      :pData="data"
      showOverflowTooltip
      pStripe
      tableLayout="fixed"
      @selection-change="handleSelectUser"
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
      <template v-if="!isAccountManagement">
        <PTableColumn
          :pLabel="t('dateAdded')"
          pProp="creationDate"
          pSortable
        >
          <template #default="scope">
            {{ d(scope.row.creationDate, 'short') }}
          </template>
        </PTableColumn>
        <PTableColumn
          :pLabel="t('options')"
          :pWidth="100"
          pProp="options"
        >
          <template #default="scope">
            <PToolbox
              trigger="click"
              :pElements="menuElements"
              @p-toolbox-item-clicked="$event => handleToolboxItemClick($event, scope.row)"
            >
              <PButton
                pType="generic"
                pSize="small"
              >
                <PIcon pName="threeDots" />
              </PButton>
            </PToolbox>
          </template>
        </PTableColumn>
      </template>
      <template v-else>
        <PTableColumn
          :pLabel="t('status')"
          :pWidth="150"
          pSortable="custom"
          pProp="status"
        >
          <template #default="scope">
            <PTag
              :pContent="scope.row.statusTag.text"
              :pColor="scope.row.statusTag.color"
              :pIconLeftName="scope.row.statusTag.iconName"
              pEffect="light"
            />
          </template>
        </PTableColumn>
        <PTableColumn
          :pShowOverflowTooltip="false"
          pType="selection"
        />
      </template>
    </PTable>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  PAvatar,
  PButton,
  PIcon,
  PTable,
  PTableColumn,
  PToolbox,
  PTag,
} from '@pulse/styleguide/components'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import { computed, reactive } from 'vue'
import { userPermissions } from '@pulse/common'
import type { Props } from './types'
import { MENU_ACTIONS_NAME } from './constants'
import { PERMISSION_CODES, DATE_TIME_FORMATS as datetimeFormats } from '@entities/constants'
import type { ExtendedUser } from '../../UsersClientTypes'
import { userActions } from './types'

const { d, t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const props = defineProps<Props>()
const { hasPermission } = userPermissions()
const emit = defineEmits<{
  'click-view-information': [number]
  'display-manage-rights': [number]
  'remove-user': [ExtendedUser]
  'select-user': [number[]]
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
  rowData: {} as ExtendedUser,
})

const handleToolboxItemClick = (action: string, row: any) => {
  state.rowData = row
  if (action === userActions.MODIFY_RIGHTS) {
    emit('display-manage-rights', row.contactId)
  }
  if (action === userActions.REMOVE_USER) {
    emit('remove-user', row)
  }
  if (action === userActions.USER_INFORMATION) {
    emit('click-view-information', row.contactId)
  }
}
const handleSelectUser = (users: ExtendedUser[]) => {
  emit('select-user', users.map((user) => user.contactId))
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
  status: 'Status'
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
  status: 'Statut'
  userInformation: "Informations de l'utilisateur"
  modifyRights: 'Modifier les droits'
  removeUser: "Retirer l'utilisateur"
  deleteUser: "Supprimer l'utilisateur"
  you: 'Vous'
</i18n>
