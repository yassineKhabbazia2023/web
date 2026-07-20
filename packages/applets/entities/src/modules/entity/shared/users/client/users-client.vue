<template>
  <div class="flex flex--direction-column user-clients">
    <div class="flex--grow-1 padding--2">
      <AddCustomerDrawer
        v-if="currentEntityId && currentEntityName && isAddCustomerDrawerOpened"
        v-model="isAddCustomerDrawerOpened"
        :targetEntityId="currentEntityId"
        :targetEntityName="currentEntityName"
        :targetEntityNumber="currentEntityAccountNumber"
        :targetEntityAccountType="currentAccountType"
        @refresh-customers-list="fetchUsers"
      />
      <div
        class="
          flex
          flex--align-items-center
          flex--justify-content-space-between
          margin-bottom--6
        "
      >
        <FormSearch
          class="user-clients__search-bar margin-right--4 max-width-500"
          :placeholder="t('searchUsers')"
          @search-value-submitted="handleSearchValueSubmitted"
        />
        <PButton
          v-if="isAddUserButtonVisible"
          pType="primary"
          pSize="small"
          data-testid="add-customer-button"
          @click="isAddCustomerDrawerOpened = true"
        >
          <PIcon pName="personAdd" />
          <span class="padding-left--2">{{ t('addCustomer') }}</span>
        </PButton>
      </div>

      <div
        v-if="state.isLoading"
        class="loader flex flex--justify-content-center flex--align-items-center"
      >
        <PLoader pType="primary" pSize="50" />
      </div>

      <div v-show="state.isLoading === false">
        <UsersList
          v-if="state.data.length"
          :data="state.data"
          :isInAnEntityPage="!!entityId"
          :canManageUsers="!!entityId"
          :canRemoveSignatoryUsers="currentAccountType !== AccountType.PROSPECT"
          @click-view-information="handleClickViewInformation"
          @display-manage-rights="handleDisplayManageRights"
          @remove-user="handleRemoveUser"
          @sort-user="handleSortUser"
        />

        <NoResult v-if="state.data.length === 0" />
      </div>
    </div>

    <PPagination
      v-if="shouldShowPagination && state.totalItems"
      v-model:p-current-page="state.currentPage"
      v-model:p-page-size="state.limit"
      :pTotal="state.totalItems"
      :pPageSizes="pageSizes"
      pPageSizeSelectorSuffix=""
      pShowTotalPageCounter
      class="flex--grow-0 flex--shrink-0 margin-negative-x--2"
      @on-page-range-changed="handlePageRangeChanged"
    >
      <p>{{ paginationLabel }}</p>
    </PPagination>

    <RemoveUserDialog
      v-if="state.isRemoveUserDialogOpened && state.userToRemove"
      v-model="state.isRemoveUserDialogOpened"
      :userToRemove="state.userToRemove"
      @user-removed="fetchUsers"
    />

    <DrawerUserDetails
      v-if="state.isDrawerViewDetailsOpened && currentEntityId"
      v-model="state.isDrawerViewDetailsOpened"
      :userId="state.selectedUserId"
      :entityId="currentEntityId"
      :hasDrawerOpened="state.isDrawerViewDetailsOpened"
      :editMode="canEdit"
      data-testid="viewinfo-drawer"
      @contact-patched="handlePatch"
    />

    <ManageRightsDrawer
      v-if="state.isManageRightsDrawerOpened && currentEntity !== undefined"
      v-model="state.isManageRightsDrawerOpened"
      :selectedUser="getUserInfo"
      :currentEntity="currentEntity"
    />
  </div>
</template>

<script setup lang="ts">
import { logger } from '@pulse/toolbox'
import { useI18n } from 'vue-i18n'
import { computed, onMounted, reactive, watch, ref } from 'vue'
import { PLoader, PPagination, PButton, PIcon } from '@pulse/styleguide/components'
import { CurrentUserManager } from '@pulse/common/managers'
import { removeFalsyValues } from '@pulse/toolbox/utils/object'
import { removeDiacritics } from '@pulse/toolbox/utils/string'
import { PAGE_SIZES, MOBILE_PAGE_SIZES, ACTION_PERMISSIONS } from '@pulse/common/constants'
import { useResponsive } from '@pulse/styleguide'
import NoResult from '@entities/components/NoResult'
import FormSearch from '@entities/components/FormSearch'
import ManageRightsDrawer from '@entities/components/ManageRightsDrawer'
import UsersList from '@entities/components/users-list'
import DrawerUserDetails from '../components/drawer-user-details'
import RemoveUserDialog from '../components/remove-user-dialog'
import AddCustomerDrawer from '../components/add-customer-drawer'
import type { User } from '@entities/types'
import { formatItemsFromApi } from '@entities/helpers'
import type { UsersClientProps, State } from '../types/users-client.types'
import { fetchAccountContacts, fetchCustomers } from '@entities/services/wallet'
import { storeToRefs } from 'pinia'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { AccountType, ContactType } from '@pulse/common/enums'
import type { SortingCriteria } from '@pulse/common/types'
import { useSort } from '@pulse/common/composables/sort'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      addCustomer: 'Add a customer',
      searchUsers: 'Search by name, first name, email',
      on: 'on',
    },
    'fr-FR': {
      addCustomer: 'Ajouter un utilisateur',
      searchUsers: 'Rechercher par nom, prénom, e-mail',
      on: 'sur',
    },
  },
})

const userStore = useUserStore()

const { isMobile } = useResponsive()
const pageSizes = computed(() =>
  isMobile.value ? [5, ...MOBILE_PAGE_SIZES, ...PAGE_SIZES] : PAGE_SIZES,
)
const currentPageSize = ref(pageSizes.value[0])

const state: State = reactive({
  data: [],
  currentPage: 1,
  limit: currentPageSize.value,
  totalPages: undefined,
  totalItems: undefined,
  search: undefined,
  sorting: {
    descending: false,
    field: undefined,
  },
  isLoading: true,
  isDrawerViewDetailsOpened: false,
  isManageRightsDrawerOpened: false,
  isRemoveUserDialogOpened: false,
  selectedUserId: 0,
  userToRemove: undefined,
})

const isMounted = ref(false)

const canAddUser = computed(() => CurrentUserManager.hasPermission(ACTION_PERMISSIONS.ADD_USERS))

const handleSearchValueSubmitted = (newSearchValue: string) => {
  state.currentPage = 1
  state.search = newSearchValue
}

const handlePageRangeChanged = (newItemsPerPage: number) => {
  state.currentPage = 1
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

const canEdit = computed(() => CurrentUserManager.hasPermission(ACTION_PERMISSIONS.MODIFY_RIGHTS_USER))

const getUserInfo = computed(() => {
  const userInfo = state.data.find(
    (user) => user.contactId === state.selectedUserId,
  )

  return {
    ...userInfo,
    role: userInfo?.personaName,
  } as User
})

function getQueryParams(type: string | undefined) {
  return {
    pageNumber: state.currentPage,
    pageSize: state.limit,
    search: removeDiacritics(state.search),
    'sorting.field': state.sorting.field,
    'sorting.descending': state.sorting.descending,
    Type: type,
  }
}

const props = defineProps<UsersClientProps>()

async function fetchUsers() {
  state.isLoading = true

  try {
    const type = props.entityId ? ContactType.CUSTOMER : undefined
    const queryParams = getQueryParams(type)
    const queryParamsWithoutUndefined = removeFalsyValues(queryParams)
    const searchParams = new URLSearchParams(queryParamsWithoutUndefined)
    const data = props.entityId
      ? await fetchAccountContacts(props.entityId, searchParams)
      : await fetchCustomers(searchParams)

    const { items, currentPage, totalPages, totalItems } = data

    state.data = formatItemsFromApi(items, userStore.user?.id)
    state.currentPage = currentPage
    state.totalPages = totalPages
    state.totalItems = totalItems
  } catch (err) {
    logger.error(err)
  } finally {
    state.isLoading = false
  }
}

const handlePatch = async () => {
  await fetchUsers()
}
const handleClickViewInformation = (selectedUserId: number) => {
  state.selectedUserId = selectedUserId
  state.isDrawerViewDetailsOpened = true
}

const handleDisplayManageRights = (selectedUserId: number) => {
  state.selectedUserId = selectedUserId
  state.isManageRightsDrawerOpened = true
}

const handleRemoveUser = (row: any) => {
  state.userToRemove = row
  state.isRemoveUserDialogOpened = true
}

const handleSortUser = async (param: SortingCriteria) => {
  const { handleSortCriteria } = useSort()
  handleSortCriteria(param, state)
}

const currentEntityStore = useCurrentEntityStore()
const {
  currentEntity,
  currentEntityId,
  currentEntityAccountNumber,
  currentAccountType,
} = storeToRefs(currentEntityStore)
const currentEntityName = computed(() => currentEntity.value?.legalName)

const isAddCustomerDrawerOpened = ref(false)

const isAddUserButtonVisible = computed(() =>
  currentEntityId.value &&
  isMounted.value &&
  canAddUser.value &&
  isMobile.value === false,
)

onMounted(async () => {
  isMounted.value = true
  await fetchUsers()
})

watch(
  () => [
    state.currentPage,
    state.limit,
    state.search,
    state.sorting.field,
    state.sorting.descending,
  ],
  async () => {
    await fetchUsers()
  },
)
</script>

<style lang="scss" scoped>
.user-clients {
  &__search-bar {
    width: 100%;
  }
  // due to the bottom bar on small screens
  @media (min-width: 993px) {
    min-height: 100%;
  }
}
</style>
