<template>
  <div class="shadow--3 radius--2 overflow-hidden margin-top--6">
    <PBlockHeader
      :pTitle="t('userTitle')"
      :pDescription="t('userDescription')"
      pColor="gray"
      :pHasButton="false"
      :pImage="{
        pFit: 'fill',
        pType: 'portrait',
        pName: 'user-female'
      }"
      data-testid="folder-users-collab-block-header"
    />
    <div
      v-if="state.isLoading"
      class="flex flex--justify-content-center margin-y--4"
      data-testid="folder-users-collab-loader"
    >
      <PLoader pType="primary" pSize="50" />
    </div>
    <PTable
      v-else
      ref="selectedRow"
      :pData="state.data"
      tableLayout="fixed"
      data-testid="folder-users-table"
      showOverflowTooltip
      pStripe
    >
      <PTableColumn
        :pLabel="t('user')"
        pProp="lastName"
        pSortable
      >
        <template #default="scope">
          <div class="flex flex--align-items-center">
            <div class="margin-right--2">
              <PAvatar
                pColor="bordered-persian"
                pType="small"
              >
                {{ scope.row.initials }}
              </PAvatar>
            </div>
            <p>{{ scope.row.fullName }}</p>
          </div>
        </template>
      </PTableColumn>
      <PTableColumn
        :pLabel="t('email')"
        pProp="email"
        pSortable
      >
        <template #default="scope">
          <p>
            {{ scope.row.email }}
          </p>
        </template>
      </PTableColumn>
      <PTableColumn
        :pLabel="t('status')"
        pSortable
        pProp="status.text"
      >
        <template #default="scope">
          <PTag
            :pContent="scope.row.status.text"
            :pColor="scope.row.status.color"
            :pIconLeft="scope.row.status.icon"
            pEffect="light"
          />
        </template>
      </PTableColumn>
      <PTableColumn
        :pLabel="t('role')"
        pSortable
        pProp="role"
      >
        <template #default="scope">
          <div
            v-if="scope.row.isOwner"
            class="owner-role flex flex--align-items-center"
          >
            <PIcon pSize="14px" class="margin-right--1">
              <PIPatchCheck />
            </PIcon>
            {{ scope.row.role }}
          </div>
          <div v-if="!scope.row.isOwner">
            <p>
              {{ scope.row.role }}
            </p>
          </div>
        </template>
      </PTableColumn>
      <PTableColumn
        :pLabel="t('dateAccess')"
        pSortable
        :pSortMethod="sortDate"
        pProp="firstDateAccess"
      >
        <template #default="scope">
          {{ scope.row.firstDateAccess }}
        </template>
      </PTableColumn>
      <PTableColumn
        :pLabel="t('action')"
        :pWidth="100"
      >
        <template #default>
          <PToolbox
            trigger="click"
            popperClass="toolbox-container"
            :pElements="toolboxItems"
          >
            <PButton
              pType="white"
              pSize="small"
              class="margin-left--1"
            >
              <PIcon>
                <PIThreeDots color="#A4A4A4" />
              </PIcon>
            </PButton>
          </PToolbox>
        </template>
      </PTableColumn>
    </PTable>

    <PPagination
      v-if="state.totalItems"
      @on-page-range-changed="handlePageRangeChanged"
      v-model:p-current-page="state.currentPage"
      v-model:p-page-size="state.limit"
      :pTotal="state.totalItems"
      :pPageSizes="PAGE_SIZES"
      :pPageSizeSelectorGroupLabel="t('numberOfFoldersPerPage')"
      pPageSizeSelectorSuffix=""
      pShowTotalPageCounter
      pBackground
    >
      <p>{{ paginationLabel }}</p>
    </PPagination>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, watch } from 'vue'
import {
  PTable,
  PTableColumn,
  PTag,
  PToolbox,
  PButton,
  PIcon,
  PIThreeDots,
  PIPatchCheck,
  PLoader,
  PAvatar,
  PIPerson,
  PPagination,
  PBlockHeader,
  type PToolboxItemProps,
} from '@kpmg/styleguide'
import { commonStore, getInitials } from '@kpmg/common'
import {
  PAGE_SIZES,
  DATE_TIME_FORMATS as datetimeFormats,
} from '@/constants'
import { getFullName } from '@/common/utils'
import { fetchAccountCustomers } from '@/services/wallet'
import { getPaginationLabel } from '@/helper'
import type { IStateUser, IUserStatus, IUser } from './types'

const { d, t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const route = useRoute()
const { user } = storeToRefs(commonStore())

const state: IStateUser = reactive({
  data: [],
  currentPage: 1,
  limit: 15,
  totalPage: 1,
  totalItems: 0,
  isLoading: false,
})
const toolboxItems: PToolboxItemProps[] = [
  {
    pIconName: 'PIPatchCheck',
    pValue: t('assignSignatory'),
    pActionName: 'assign',
    pState: 'default',
  },
  {
    pIconName: 'PIPencilSquare',
    pValue: t('modifyRights'),
    pActionName: 'rights',
    pState: 'default',
  }]

const paginationLabel = computed(() => getPaginationLabel<IUser>(t('on'), state))

const formatAndFillUsersCollabTable = async () => {
  state.isLoading = true
  try {
    const data = await fetchAccountCustomers(+route.params.id)

    /**
     * 🛠️ TODO: Need to create a function format inside utils folder
     */
    const formattedData: IUser[] = data.map((userFromApi) => {
      return {
        initials: getInitials(userFromApi.firstName, userFromApi.lastName),
        status: getStatus(userFromApi.status),
        firstName: userFromApi.firstName?.toLowerCase() ?? '',
        lastName: userFromApi.lastName?.toUpperCase() ?? '',
        fullName: getFullName({ firstName: userFromApi.firstName, lastName: userFromApi.lastName }) ?? '',
        email: userFromApi.email,
        role: userFromApi.personaName,
        firstDateAccess: d(new Date(userFromApi.creationDate), 'short'),
        isOwner: Number.parseInt(user.value?.id ?? '') === userFromApi.contactId,
      }
    })

    /**
     * 🛠️ TODO: Need to get pagination data from API
     */
    state.data = formattedData
    state.totalItems = formattedData.length
  } catch (err) {
    console.error(err)
  } finally {
    state.isLoading = false
  }
}

/**
 * 🛠️ TODO: Need to add a global function for retrieving status instead of creating it each time
 */
const getStatus = (status: string): IUserStatus => {
  switch (status) {
    case 'Connecté':
      return {
        text: t('statusConnect'),
        icon: PIPatchCheck,
        color: 'success',
      }
    default:
      return {
        text: t('statusInvite'),
        icon: PIPerson,
        color: 'warning',
      }
  }
}

const handlePageRangeChanged = (newValue: number) => {
  state.limit = newValue
}

const sortDate = (a: any, b: any) => (Date.parse(a.firstDateAccess) / 1000) - (Date.parse(b.firstDateAccess) / 1000)

watch(() => [
  state.currentPage,
  state.limit,
], async () => {
  await formatAndFillUsersCollabTable()
})

onMounted(async () => {
  await formatAndFillUsersCollabTable()
})

</script>

<style lang="scss">
.owner-role {
  color: var(--el-color-primary);
  font-weight: 700;
}

.toolbox-container {
  .el-scrollbar {
    padding: 5px 0px;
  }
  .p-toolbox-item__text {
    width: 230px;
  }
}

</style>

<i18n lang="yaml">
  en-US:
    role: 'Function'
    user: 'User'
    status: 'Status'
    action: 'Action'
    email: 'Email'
    dateAccess: 'First date access'
    assignSignatory: 'Designate as signatory'
    modifyRights: 'Change the rights'
    statusConnect: 'Connected'
    statusInvite: 'Invited'
    numberOfFoldersPerPage: 'number of folder per page'
    userTitle: 'Users'
    userDescription: 'Manage here users''s rights for this folder.'
    on: 'on'
  fr-FR:
    role: 'Rôle'
    user: 'Utilisateur'
    status: 'Statut'
    action: 'Action'
    email: 'E-mail'
    dateAccess: 'Date d''ajout'
    assignSignatory: 'Désigner en tant que signataire'
    modifyRights: 'Modifier les droits'
    statusConnect: 'Connecté'
    statusInvite: 'Invité'
    numberOfFoldersPerPage: 'nombre de dossier par page'
    userTitle: 'Les utilisateurs'
    userDescription: 'Gérer ici les droits des utilisateurs sur le dossier.'
    on: 'sur'
</i18n>
