<template>
  <div>
    <PResponsiveTable
      :pData="data"
      :pDisableResponsive="isCollab"
      showOverflowTooltip
      pStripe
      tableLayout="fixed"
      data-testid="folder-users-table"
      @selection-change="handleSelectUser"
      @sort-change="handleSort"
    >
      <PTableColumn
        :pLabel="t('user')"
        pProp="name"
        pSortable="custom"
        :pSortOrders="SORT_ORDERS"
      >
        <template #default="scope">
          <div class="flex flex--align-items-center">
            <div class="margin-right--2">
              <PAvatar
                :pRole="AvatarRoles.CLIENT"
                pType="small"
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
                <span v-if="scope.row.isLoggedUser === false">
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
        pSortable="custom"
        :pSortOrders="SORT_ORDERS"
      />
      <template v-if="isAccountManagement === false">
        <PTableColumn
          :pLabel="t('dateAdded')"
          pProp="creationDate"
          pSortable="custom"
          :pSortOrders="SORT_ORDERS"
        >
          <template #default="scope">
            {{ d(scope.row.creationDate, 'short') }}
          </template>
        </PTableColumn>
        <PTableColumn
          v-if="canManageUsers"
          :pLabel="t('options')"
          :pWidth="100"
          pProp="options"
        >
          <template #default="scope">
            <PToolbox
              trigger="click"
              :pElements="menuElements"
              @p-toolbox-item-clicked="($event: string) => handleToolboxItemClick($event, scope.row)"
            >
              <PButton
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
            />
          </template>
        </PTableColumn>
        <PTableColumn
          :pShowOverflowTooltip="false"
          pType="selection"
        />
      </template>

      <!-- Mobile card -->
      <template #mobile-title="{ row }">
        <div class="flex flex--align-items-center overflow-hidden">
          <PAvatar
            :pRole="AvatarRoles.CLIENT"
            class="margin-right--4"
          >
            {{ row.initials }}
          </PAvatar>
          <div class="overflow-hidden">
            <p
              class="
                text-capitalize
                overflow-hidden
                text-overflow--ellipsis
                no-wrap
              "
              :class="{
                'font-bold': row.isSignatory,
              }"
            >
              <span v-if="row.isLoggedUser">{{ t('you') }}</span>
              <span v-if="row.isLoggedUser === false">
                {{ row.firstName }}
                <span class="text-uppercase"> {{ row.lastName }}</span>
              </span>
            </p>
            <p
              class="
                text-color--gray-500
                font-small
                overflow-hidden
                text-overflow--ellipsis
                no-wrap
              "
            >
              {{ row.email }}
            </p>
            <p
              v-if="isAccountManagement === false"
              class="text-color--gray-500 font-small"
            >
              {{ t('dateAdded') }} : {{ d(row.creationDate, 'short') }}
            </p>
          </div>
        </div>
      </template>
    </PResponsiveTable>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  PAvatar,
  PButton,
  PIcon,
  PResponsiveTable,
  PTableColumn,
  PToolbox,
  PTag,
} from '@pulse/styleguide/components'
import { AvatarRoles } from '@pulse/styleguide'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import { computed } from 'vue'
import { CurrentUserManager } from '@pulse/common/managers'
import { useUserStore } from '@pulse/common/stores'
import { storeToRefs } from 'pinia'
import type { UsersListProps } from './types'
import { MENU_ACTIONS_NAME } from './constants'
import { DATE_TIME_FORMATS as datetimeFormats } from '@pulse/common/i18n'
import { ACTION_PERMISSIONS, SORT_ORDERS } from '@pulse/common/constants'
import type { ExtendedUser } from '../../UsersClientTypes'
import { UserActions } from '@entities/modules/entity/enums'
import type { SortChangeEventData, SortingCriteria } from '@pulse/common/types'
import { SortDirection } from '@pulse/common/enums'

const { d, t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const userStore = useUserStore()
const { isCollab } = storeToRefs(userStore)

const props = defineProps<UsersListProps>()
const emit = defineEmits<{
  'click-view-information': [number]
  'display-manage-rights': [number]
  'remove-user': [ExtendedUser]
  'select-user': [number[]]
  'sort-user': [SortingCriteria]
}>()

const {
  modifyRights,
  removeUser,
  userInformation,
} = MENU_ACTIONS_NAME
const menuElements = computed<PToolboxItemProps[]>(() =>
  [
    {
      pIconName: 'person',
      pValue: t('userInformation'),
      pActionName: userInformation,
      pState: 'default',
      display: true,
    },
    {
      pIconName: 'pencilSquare',
      pValue: t('modifyRights'),
      pActionName: modifyRights,
      pState: 'default',
      display: CurrentUserManager.hasPermission(ACTION_PERMISSIONS.MODIFY_RIGHTS_USER) && props.isInAnEntityPage,
    },
    {
      pIconName: 'personRemove',
      pValue: t('removeUser'),
      pActionName: removeUser,
      pState: 'default',
      display: CurrentUserManager.hasPermission(ACTION_PERMISSIONS.DELETE_USER) && props.isInAnEntityPage,
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

const handleToolboxItemClick = (action: string, row: ExtendedUser) => {
  if (action === UserActions.MODIFY_RIGHTS) {
    emit('display-manage-rights', row.contactId)
  }
  if (action === UserActions.REMOVE_USER) {
    emit('remove-user', row)
  }
  if (action === UserActions.USER_INFORMATION) {
    emit('click-view-information', row.contactId)
  }
}
const handleSelectUser = (users: ExtendedUser[]) => {
  emit('select-user', users.map((user) => user.contactId))
}

const handleSort = (data: SortChangeEventData) => {
  emit('sort-user', {
    field: data.prop,
    descending: data.order === SortDirection.DESCENDING,
  })
}
</script>

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
  you: 'Vous'
</i18n>
