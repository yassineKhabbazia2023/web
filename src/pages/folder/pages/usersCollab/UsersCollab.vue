<template>
  <div>
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
      data-testid="pblockHeaders"
    />
    <PLoader v-if="state.isLoading" />
    <PTable
      v-if="!state.isLoading"
      ref="selectedRow"
      :pData="state.data"
      highlightCurrentRow
      showOverflowTooltip
      pStripe
      tableLayout="fixed"
      class="wallet-table shadow-3"
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
      v-if="state.totalItems > state.limit"
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
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  PAGE_SIZES,
  DATE_TIME_FORMATS as datetimeFormats,
} from '@/constants'
import { getInitials, getPaginationLabel } from '@/helper'
import type { IStateUser, IUserStatus, IUser, IGetAccountRelatedUsersResponse } from './types'
import { commonStore, commonApi } from '@kpmg/common'

const userStore = commonStore()

const currentUserId = ref(userStore.$state?.user?.id)
const currentAccountId = ref(userStore.$state?.user?.entities.default?.accountId)
const state: IStateUser = reactive({
  data: [],
  currentPage: 1,
  limit: 15,
  totalPage: 0,
  totalItems: 0,
  isLoading: false,
})

const fetch = async () => {
  state.isLoading = true
  try {
    const data: IGetAccountRelatedUsersResponse =
      await commonApi().gateway.get(`account/api/accounts/${currentAccountId.value}/contacts?type=customer`)

    const formattedData: IUser[] = data.data.map((userFromApi) => {
      return {
        initials: getInitials(userFromApi.firstName, userFromApi.lastName),
        status: getStatus(userFromApi.status),
        firstName: userFromApi.firstName?.toLowerCase() ?? '',
        lastName: userFromApi.lastName?.toUpperCase() ?? '',
        fullName: getFullName({ firstName: userFromApi.firstName, lastName: userFromApi.lastName }) ?? '',
        email: userFromApi.email,
        role: userFromApi.personaName,
        firstDateAccess: d(new Date(userFromApi.creationDate), 'short'),
        isOwner: Number.parseInt(currentUserId.value ?? '') === userFromApi.contactId,
      }
    })

    state.data = formattedData
  } catch (err) {
    console.error(err)
  } finally {
    state.isLoading = false
  }
}

const getFullName = ({ firstName, lastName }: { firstName: string, lastName: string }) => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  }
}

const { d, t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
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

const paginationLabel = computed(() => getPaginationLabel<IUser>(t('on'), state))

onMounted(async () => {
  await fetch()
  watch(() => [
    state.currentPage,
    state.limit,
  ], async () => {
    await fetch()
  })
})

const sortDate = (a: any, b: any) => (Date.parse(a.firstDateAccess) / 1000) - (Date.parse(b.firstDateAccess) / 1000)
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
