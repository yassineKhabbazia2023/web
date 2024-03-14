<template>
  <div>
    <PBlockHeader
      v-if="isCollab"
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
            <div>
              <PAvatar
                class="margin-right--2"
                pColor="bordered-persian"
                pType="small"
              >
                {{ scope.row.initials }}
              </PAvatar>
              {{ scope.row.fullName }}
              <PTag
                class="margin-left--4"
                v-if="scope.row.isOwner && !isCollab"
                :pContent="t('owner')"
                pColor="persian"
                :pIconLeft="PIPatchCheck"
                pEffect="light">
              </PTag>
            </div>
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
        v-if="isCollab"
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
          <div v-if="scope.row.isOwner && isCollab" class="owner-role flex flex--align-items-center">
            <PIcon pSize="14px" class="margin-right--1">
              <PIPatchCheck />
            </PIcon>
            {{ scope.row.role }}
          </div>
          <div v-else>
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
  type PToolboxItemProps
} from '@kpmg/styleguide'
import { computed, onMounted, reactive, watch } from 'vue'
import { commonStore } from '@kpmg/common'
import { PAGE_SIZES } from '@/constants'
import { IStateUser, IUserStatus } from './types'
import { dataFromApi } from './mockData'
import { storeToRefs } from 'pinia'

const state: IStateUser = reactive({
  data: [],
  currentPage: 1,
  limit: 15,
  totalPage: 0,
  totalItems: 0,
  isLoading: false
})
const userStore = commonStore()
const { isCollab } = storeToRefs(userStore)

// Uncomment when implement call API
// const getQueryParams = () => ({
//   page: state.currentPage,
//   limit: state.limit
// })

// const removeFalsyValues = (obj: object) =>
//   Object.entries(obj)
//     // eslint-disable-next-line no-return-assign
//     .reduce((acc: any, [key, value]) => (value ? (acc[key] = value, acc) : acc), {})

const fetch = async () => {
  state.isLoading = true
  try {
    const {
      data: {
        items,
        currentPage,
        totalPage,
        totalItems
      }
    } = dataFromApi
    state.data = items.map(({
      status,
      firstName,
      lastName,
      ...rest
    }) => ({
      status: getStatus(status),
      firstName: firstName?.toLowerCase() ?? '',
      lastName: lastName?.toUpperCase() ?? '',
      initials: getInitial({ firstName, lastName }),
      fullName: getFullName({ firstName, lastName }),
      ...rest
    }))
    state.currentPage = currentPage
    state.totalPage = totalPage
    state.totalItems = totalItems
  } catch (err) {
    console.error(err)
  } finally {
    state.isLoading = false
  }
}

const getFullName = ({ firstName, lastName }: { firstName: string, lastName: string }) => {
  if (firstName && lastName) {
    return firstName + ' ' + lastName
  }
}

const getInitial = ({ firstName, lastName }: { firstName: string, lastName: string }) => {
  if (firstName && lastName) {
    return firstName[0] + lastName[0]
  }
}

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const collaboratorToolboxItem: PToolboxItemProps[] = [
  {
    pIconName: 'PIPatchCheck',
    pValue: t('assignSignatory'),
    pActionName: 'assign',
    pState: 'default'
  },
  {
    pIconName: 'PIPencilSquare',
    pValue: t('modifyRights'),
    pActionName: 'rights',
    pState: 'default'
  }]

const clientToolboxItem: PToolboxItemProps[] = [
  {
    pIconName: 'PIPencilSquare',
    pValue: t('modifyRights'),
    pActionName: 'rights',
    pState: 'default'
  }]

const getStatus = (status: string): IUserStatus => {
  switch (status) {
    case 'Connecté':
      return {
        text: t('statusConnect'),
        icon: PIPatchCheck,
        color: 'success'
      }
    default:
      return {
        text: t('statusInvite'),
        icon: PIPerson,
        color: 'warning'
      }
  }
}

const handlePageRangeChanged = (newValue: number) => {
  state.limit = newValue
}

const paginationLabel = computed(() =>
  `${1 + ((state.currentPage - 1) * state.limit)}
   - ${((state.currentPage - 1) * state.limit) +
    state.data.length}
   ${t('on')} ${state.totalItems}`
)

onMounted(async () => {
  await fetch()
  watch(() => [
    state.currentPage,
    state.limit
  ], async () => {
    await fetch()
  })
})

const sortDate = (a: any, b: any) => (Date.parse(a.firstDateAccess) / 1000) - (Date.parse(b.firstDateAccess) / 1000)
const toolboxItems = isCollab.value ? collaboratorToolboxItem : clientToolboxItem

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
    owner: 'Owner'
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
    owner: 'Dirigeant'
</i18n>
