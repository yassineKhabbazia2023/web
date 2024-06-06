<template>
  <div class="flex flex--direction-column sticky-wrapper">
    <div class="flex--grow-1 padding--2">
      <!-- the target for this teleport is the page folder, here src/pages/folder/Folder.vue -->
      <Teleport
        v-if="shouldDisplayTeleport"
        to=".folder__teleported-content"
      >
        <PButton
          @click="isAddCustomerDrawerOpened = true"
          pType="primary"
          pSize="small"
          data-testid="add-customer-button"
        >
          <PIcon>
            <PIPersonAdd />
          </PIcon>
          <span class="padding-left--2">{{ t('addCustomer') }}</span>
        </PButton>
      </Teleport>

      <AddCustomerDrawer
        v-if="currentEntityId &&
          currentEntityName &&
          currentEntityNumber &&
          isAddCustomerDrawerOpened
        "
        v-model="isAddCustomerDrawerOpened"
        :targetEntityId="currentEntityId"
        :targetEntityName="currentEntityName"
        :targetEntityNumber="currentEntityNumber"
        @refresh-customers-list="fetch"
      />
      <div class="margin-bottom--6">
        <FormSearch @search-value-submitted="handleSearchValueSubmitted" />
      </div>

      <PLoader v-if="state.isLoading" />

      <div v-if="!state.isLoading">
        <TableData
          v-if="state.data.length"
          :data="state.data"
          @click-view-information="handleClickViewInformation"
          @display-manage-rights="handleDisplayManageRights"
          @on-sort-change="handleSortChange"
          @remove-user="handleRemoveUser"
        />

        <NoResult v-if="!state.data.length" />
      </div>
    </div>

    <PPagination
      v-if="shouldShowPagination && state.totalItems"
      @on-page-range-changed="handlePageRangeChanged"
      v-model:p-current-page="state.currentPage"
      v-model:p-page-size="state.limit"
      :pTotal="state.totalItems"
      :pPageSizes="PAGE_SIZES"
      :pPageSizeSelectorGroupLabel="t('numberOfUsersPerPage')"
      pPageSizeSelectorSuffix=""
      pShowTotalPageCounter
      pBackground
      class="flex--grow-0 flex--shrink-0 margin-negative-x--2"
    >
      <p>{{ paginationLabel }}</p>
    </PPagination>

    <RemoveUserDialog
      v-if="state.isRemoveUserDialogOpened && state.userToRemove"
      v-model="state.isRemoveUserDialogOpened"
      :userToRemove="state.userToRemove"
      @user-removed="fetch"
    />

    <DrawerUserDetails
      v-if="state.isDrawerViewDetailsOpened"
      v-model="state.isDrawerViewDetailsOpened"
      :userId="state.selectedUserId"
      :hasDrawerOpened="state.isDrawerViewDetailsOpened"
      :editMode="canEdit"
      @contact-patched="handlePatch"
      data-testid="viewinfo-drawer"
    />

    <ManageRightsDrawer
      v-if="state.isManageRightsDrawerOpened"
      v-model="state.isManageRightsDrawerOpened"
      :selectedUser="getUserInfo"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, onMounted, reactive, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { PLoader, PPagination, PButton, PIcon, PIPersonAdd } from '@kpmg/styleguide'
import { commonStore, commonApi, userPermissions } from '@kpmg/common'
import { removeFalsyValues } from '@/helper'
import { PAGE_SIZES, PERMISSION_CODES } from '@/constants'
import NoResult from '@/common/components/NoResult'
import FormSearch from '@/common/components/FormSearch'
import ManageRightsDrawer from '@/common/components/ManageRightsDrawer'
import { API_PREFIXES } from '@/common/config/services'
import TableData from './components/TableData'
import DrawerUserDetails from './components/DrawerUserDetails'
import RemoveUserDialog from './components/RemoveUserDialog'
import AddCustomerDrawer from './components/AddCustomerDrawer'
import type { IUser } from '../usersCollab/types'
import type { IState } from './types'
import { formatItemsFromApi } from './UsersClientHelper'
import type { UsersClientProps } from './UsersClientTypes'
import { getPrincipalContacts } from '@/services/offer'
import type { ClientContact } from '@/pages/entities/components/PrincipalContact/PrincipalContactTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const route = useRoute()
const userStore = commonStore()

const state: IState = reactive({
  data: [],
  currentPage: 1,
  limit: 15,
  totalPages: undefined,
  totalItems: undefined,
  search: undefined,
  isLoading: false,
  sort: undefined,
  isDrawerViewDetailsOpened: false,
  isManageRightsDrawerOpened: false,
  isRemoveUserDialogOpened: false,
  selectedUserId: 0,
  userToRemove: undefined,
})

const isMounted = ref(false)

const { hasPermission } = userPermissions()
const canAddUser = computed(() => hasPermission(PERMISSION_CODES.ADD_USERS))

const handleSearchValueSubmitted = (newSearchValue: string) => {
  state.search = newSearchValue
}

const handlePageRangeChanged = (newItemsPerPage: number) => {
  state.limit = newItemsPerPage
}

const paginationLabel = computed(
  () =>
    `${1 + (state.currentPage - 1) * state.limit}
    - ${(state.currentPage - 1) * state.limit + state.data.length}
    ${t('on')} ${state.totalItems}`,
)

const shouldShowPagination = computed(
  () => !state.isLoading && state.totalItems,
)

const canEdit = computed(() => true)

const getUserInfo = computed(() => {
  const userInfo = state.data.find(
    (user) => user.contactId === state.selectedUserId,
  )

  return {
    ...userInfo,
    role: userInfo?.personaName,
  } as IUser
})

const getQueryParams = () => ({
  pageNumber: state.currentPage,
  pageSize: state.limit,
  search: state.search,
  sort: state.sort,
})

const props = defineProps<UsersClientProps>()

const fetch = async () => {
  const queryParamsWithoutUndefined = removeFalsyValues(getQueryParams())
  const searchParams = new URLSearchParams(queryParamsWithoutUndefined)

  state.isLoading = true

  try {
    const {
      data: { items, currentPage, totalPages, totalItems },
    } = await commonApi().gateway.get(
      `${API_PREFIXES.CUSTOMER_WALLET}/customers/${userStore.$state.user?.id}?${searchParams}`,
    )

    state.data = formatItemsFromApi(items, userStore.$state.user?.id, principalContacts.value)
    state.currentPage = currentPage
    state.totalPages = totalPages
    state.totalItems = totalItems
  } catch (err) {
    console.error(err)
  }
  state.isLoading = false
}
const handlePatch = async () => {
  await fetch()
}
const handleClickViewInformation = (selectedUserId: number) => {
  state.selectedUserId = selectedUserId
  state.isDrawerViewDetailsOpened = true
}

const handleDisplayManageRights = (selectedUserId: number) => {
  state.selectedUserId = selectedUserId
  state.isManageRightsDrawerOpened = true
}

const handleSortChange = (sortQueryField: string) => {
  state.sort = sortQueryField
}

const handleRemoveUser = (row: any) => {
  state.userToRemove = row
  state.isRemoveUserDialogOpened = true
}

const defaultEntity = computed(() => userStore.defaultEntity)
const currentEntityId = computed(() => defaultEntity.value?.accountId)
const currentEntityName = computed(() => defaultEntity.value?.legalName)
const currentEntityNumber = computed(() => defaultEntity.value?.accountNumber)
const isAddCustomerDrawerOpened = ref(false)
const principalContacts = ref<ClientContact[]>([])

const shouldDisplayTeleport = computed(() =>
  currentEntityId.value &&
  isMounted.value &&
  canAddUser.value &&
  route.name === 'users',
)

onMounted(async () => {
  isMounted.value = true
  await loadPrincipalContacts()
  await fetch()
  console.warn(`entityId = ${props.entityId}`)
})

watch(
  () => [state.currentPage, state.limit, state.search, state.sort],
  async () => {
    await fetch()
  },
)

watch(currentEntityId, async () => await loadPrincipalContacts())

async function loadPrincipalContacts() {
  if (currentEntityId.value) {
    principalContacts.value = await getPrincipalContacts(currentEntityId.value) ?? []
  }
}
</script>

<style lang="scss" scoped>
.sticky-wrapper {
  // due to the bottom bar on small screens
  @media (min-width: 993px) {
    min-height: 100%;
  }
}
</style>

<i18n lang="yaml">
en-US:
  addCustomer: "Add a customer"
  numberOfUsersPerPage: 'Number of users per page'
  on: 'on'
fr-FR:
  addCustomer: "Ajouter un utilisateur"
  numberOfUsersPerPage: "Nombre d'utilisateurs par page"
  on: 'sur'
</i18n>
