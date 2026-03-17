<template>
  <div class="margin-top--6">
    <AddCollaboratorsDrawer
      v-if="currentEntityId && isAddCollaboratorsDrawerOpened"
      v-model="isAddCollaboratorsDrawerOpened"
      :entityId="currentEntityId"
      @refresh-collaborators-list="fetchCollaborators"
    />

    <CollabDetailsDrawer
      v-if="isCollabDetailsDrawerOpened"
      v-model="isCollabDetailsDrawerOpened"
      :collabDetails="rowDataForDrawers"
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
        class="user-collabs__search-bar margin-right--4 max-width-500"
        :placeholder="t('searchCollaborator')"
        @search-value-submitted="handleSearchValueSubmitted"
      />
      <PButton
        v-if="isAddUserButtonVisible"
        pType="primary"
        pSize="small"
        data-testid="add-collaborator-button"
        @click="isAddCollaboratorsDrawerOpened = true"
      >
        <PIcon pName="personAdd" />
        <span class="padding-left--2">{{ t('addCollaborator') }}</span>
      </PButton>
    </div>

    <div
      v-if="isLoading"
      class="loader flex flex--justify-content-center flex--align-items-center"
    >
      <PLoader pType="primary" pSize="50" />
    </div>

    <!--
      The v-show is used just below (instead of a v-if) due to the sorting on the table
      that is done on the back end side. In this case, the table should not be destroyed
      & re render else there is a bug with the caret.
    -->
    <div v-show="!isLoading">
      <PTable
        v-if="collabs.length"
        ref="selectedRow"
        :pData="collabs"
        pStripe
        tableLayout="fixed"
        class="collab-table"
        data-testid="collaborators-entity-table"
        @current-change="handleChange"
        @sort-change="handleSortChange"
      >
        <PTableColumn
          :pLabel="t('collaboratorName')"
          pSortable="custom"
          pProp="name"
          :pSortOrders="SORT_ORDERS"
        >
          <template #default="scope">
            <div class="flex flex--align-items-center">
              <PAvatar
                class="margin-right--2"
                :pRole="AvatarRoles.COLLAB"
                pType="small"
              >
                {{ getInitials(scope.row.firstName, scope.row.lastName) }}
              </PAvatar>
              <div>
                <p class="line-height--120">
                  <span class="text-capitalize">{{ scope.row.firstName }}&nbsp;</span>
                  <span class="text-uppercase"> {{ scope.row.lastName }}</span>
                </p>
              </div>
              <PTooltip
                v-if="scope.row.isCustomerRelation"
                :pContent="t('customerRelationship')"
                pPlacement="top"
              >
                <PPastille
                  pIconName="people"
                  class="margin-left--2"
                  data-testid="customer-relation-status"
                  pDisabled
                />
              </PTooltip>
            </div>
          </template>
        </PTableColumn>
        <PTableColumn
          :pLabel="t('collaboratorEmail')"
          pProp="email"
          pSortable="custom"
          :pSortOrders="SORT_ORDERS"
        />
        <PTableColumn
          :pLabel="t('collaboratorFunction')"
          pProp="personaName"
          pSortable="custom"
        >
          <template #default="scope">
            <p class="text-capitalize">
              {{ scope.row.personaName }}
            </p>
          </template>
        </PTableColumn>
        <PTableColumn
          :pLabel="t('collaboratorOffice')"
          pProp="office"
          pSortable="custom"
          :pSortOrders="SORT_ORDERS"
        >
          <template #default="scope">
            <p>
              <span class="text-capitalize"> {{ t('collaboratorOffice') }} &nbsp;</span>
              <span class="text-uppercase"> {{ scope.row.office }} </span>
            </p>
          </template>
        </PTableColumn>
        <PTableColumn
          pProp="label"
          pWidth="340"
        >
          <template #header>
            <CollaboratorRolesColumn />
          </template>
          <template #default="scope">
            <CollaboratorRolesLabelDisplay
              :roleLabels="splitRoleLabelsIntoGroups(scope.row.labels)"
            />
          </template>
        </PTableColumn>
        <PTableColumn
          v-if="toolboxItems.length > 0"
          :pLabel="t('actions')"
          :pWidth="100"
          data-testid="collaborators-action"
        >
          <template #default="scope">
            <PToolbox
              trigger="click"
              popperClass="toolbox-container"
              :pElements="toolboxItems"
              data-testid="toolbox-action"
              @p-toolbox-item-clicked="($event: string) => handleToolboxItemClick($event, scope.row)"
            >
              <PButton
                class="margin-left--1"
              >
                <PIcon pName="threeDots" />
              </PButton>
            </PToolbox>
          </template>
        </PTableColumn>
      </PTable>

      <NoResult v-if="!collabs.length" />
    </div>
  </div>

  <PPagination
    v-if="shouldShowPagination && state.totalItems"
    v-model:p-current-page="state.currentPage"
    v-model:p-page-size="state.limit"
    :pTotal="state.totalItems"
    :pPageSizes="PAGE_SIZES"
    pPageSizeSelectorSuffix=""
    pShowTotalPageCounter
    class="flex--grow-0 flex--shrink-0 margin-negative-x--2"
    @on-page-range-changed="handlePageRangeChanged"
  >
    <p>{{ paginationLabel }}</p>
  </PPagination>
</template>

<script setup lang="ts">
import { logger } from '@pulse/toolbox'
import { useI18n } from 'vue-i18n'
import {
  PTooltip,
  PAvatar,
  PButton,
  PIcon,
  PLoader,
  PPagination,
  PTable,
  PTableColumn,
  PToolbox,
  PPastille,
} from '@pulse/styleguide/components'
import { AvatarRoles, PNotification } from '@pulse/styleguide'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import {
  computed,
  onMounted,
  reactive,
  ref,
  toRaw,
  watch,
} from 'vue'
import type { ElTable } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useUserStore } from '@pulse/common/stores'
import { CurrentUserManager } from '@pulse/common/managers'
import { PAGE_SIZES, ACTION_PERMISSIONS, SORT_ORDERS } from '@pulse/common/constants'
import type { Collab } from '@entities/types'
import type { Account } from '@entities/services/account/account.type'
import type { Contact } from '@entities/services/contact/contactTypes'
import { getContactById } from '@entities/services/contact'
import { getCollaboratorsByIdEntity } from '@entities/services/collaborator'
import { deleteContactFromAccount } from '@entities/services/account'
import { getInitials } from '@entities/helpers'
import { removeFalsyValues } from '@pulse/toolbox/utils/object'
import { RouteParam, SortDirection } from '@pulse/common/enums'
import NoResult from '@entities/components/NoResult'
import FormSearch from '@entities/components/FormSearch'
import CollabDetailsDrawer from '@entities/components/CollabDetailsDrawer'
import CollaboratorRolesLabelDisplay from './components/CollaboratorRolesLabelDisplay/CollaboratorRolesLabelDisplay.vue'
import AddCollaboratorsDrawer from './components/AddCollaboratorDrawer'
import { RouterHelpers } from '@pulse/common/helpers'
import { splitRoleLabelsIntoGroups } from './utils/collaborators.utils'
import CollaboratorRolesColumn from './components/CollaboratorRolesColumn/CollaboratorRolesColumn.vue'
import { useSort } from '@pulse/common/composables/sort'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      actions: 'Actions',
      collaboratorName: 'Collaborator',
      collaboratorEmail: 'E-mail',
      collaboratorFunction: 'Function',
      collaboratorOffice: 'Office',
      on: 'on',
      addCollaborator: 'Add collaborator',
      removeCollaborator: 'Remove collaborator',
      searchCollaborator: 'Search by name, email, function, etc...',
      collaboratorInformation: 'Collaborator information',
      collaboratorHasBeenRemoved: 'The collaborator has been removed from the entity',
      collaboratorWasNotRemoved: 'The collaborator was not removed from the entity due to a technical error',
      customerRelationship: 'Customer relationship',
    },
    'fr-FR': {
      actions: 'Actions',
      collaboratorName: 'Collaborateur',
      collaboratorEmail: 'E-mail',
      collaboratorFunction: 'Fonction',
      collaboratorOffice: 'Bureau',
      on: 'sur',
      addCollaborator: 'Ajouter un collaborateur',
      removeCollaborator: 'Retirer le collaborateur',
      searchCollaborator: 'Recherche par nom, prénom, e-mail, fonction, bureau',
      collaboratorInformation: 'Informations du collaborateur',
      collaboratorHasBeenRemoved: 'Le collaborateur a bien été retiré de l\'entité',
      collaboratorWasNotRemoved: 'Le collaborateur n\'a pas été retiré de l\'entité a cause d\'une erreur technique',
      customerRelationship: 'Relation client',
    },
  },
})

const userStore = useUserStore()
const { isCollab } = storeToRefs(userStore)

const isLoading = ref(false)
const isMounted = ref(false)
const collabs = ref<Collab[]>([])

const isAddCollaboratorsDrawerOpened = ref(false)
const isCollabDetailsDrawerOpened = ref(false)

const route = useRoute()
const currentEntityId = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)

const selectedRow = ref<InstanceType<typeof ElTable>>()

const state: any = reactive({
  currentPage: 1,
  limit: 15,
  totalPages: undefined,
  totalItems: undefined,
  search: undefined,
  sorting: {
    field: undefined,
    descending: false,
  },
})

const rowDataForDrawers = ref()

const formatRowForDrawer = ({
  row: {
    personaName: role,
    contactId: id,
    firstName,
    lastName,
    ...rest
  },
  landPhone,
  mobilePhone,
}: {
  row: any
  landPhone: Contact['landPhone']
  mobilePhone: Contact['mobilePhone']
}) => ({
  ...rest,
  id,
  landPhone,
  mobilePhone,
  firstName,
  lastName,
  role,
  fullName: `${firstName} ${lastName}`,
})

const getPhonesNumberOfContactId = async (contactId: Contact['id']) => {
  try {
    const { landPhone, mobilePhone } = await getContactById(contactId) ?? {}
    return { landPhone, mobilePhone }
  } catch (error) {
    logger.error(error)
  }
}

const handleToolboxItemClick = async (action: string, row: any) => {
  const rowToRaw = toRaw(row)

  if (action === 'collaboratorInformation') {
    // the phone number are missing from the result of the fetch API
    // that why there is another call here
    const {
      landPhone = '',
      mobilePhone = '',
    } = await getPhonesNumberOfContactId(rowToRaw.contactId) ?? {}

    rowDataForDrawers.value = formatRowForDrawer({ row: rowToRaw, landPhone, mobilePhone })
    isCollabDetailsDrawerOpened.value = true
  }

  if (action === 'removeCollaborator') {
    const { contactId } = rowToRaw

    if (currentEntityId) {
      removeCollaborator(currentEntityId, contactId)
    }
  }
}

const displaySuccessNotificationRemovedCollaborator = () => {
  PNotification({
    message: t('collaboratorHasBeenRemoved'),
    iconName: 'check',
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
  })
}

const displayErrorNotificationRemovedCollaborator = () => {
  PNotification({
    message: t('collaboratorWasNotRemoved'),
    iconName: 'exclamationTriangle',
    showClose: true,
    customClass: 'error',
    position: 'bottom-right',
  })
}

const removeCollaborator = async (
  currentEntityId: Account['accountId'],
  contactId: Contact['id'],
) => {
  try {
    await deleteContactFromAccount(currentEntityId, contactId)
    displaySuccessNotificationRemovedCollaborator()
    await fetchCollaborators()
  } catch (error) {
    displayErrorNotificationRemovedCollaborator()
    logger.error(error)
  }
}

const handleSearchValueSubmitted = (newSearchValue: string) => {
  state.currentPage = 1
  state.search = newSearchValue
}

const handlePageRangeChanged = (newItemsPerPage: number) => {
  state.currentPage = 1
  state.limit = newItemsPerPage
}

const handleSortChange = ({ prop, order }: { prop: string, order: string }) => {
  const sortCriteria = {
    field: prop,
    descending: order === SortDirection.DESCENDING,
  }
  const { handleSortCriteria } = useSort()
  handleSortCriteria(sortCriteria, state)
}

const paginationLabel = computed(() =>
  `${1 + ((state.currentPage - 1) * state.limit)}
    - ${((state.currentPage - 1) * state.limit) +
    collabs.value.length}
    ${t('on')} ${state.totalItems}`,
)

const toolboxItems = computed(
  () =>
    [
      {
        pIconName: 'person',
        pValue: t('collaboratorInformation'),
        pActionName: 'collaboratorInformation',
        pState: 'default',
        display: isCollab.value,
      },
      {
        pIconName: 'trash',
        pValue: t('removeCollaborator'),
        pActionName: 'removeCollaborator',
        pState: 'default',
        display: isCollab.value && CurrentUserManager.hasPermission(ACTION_PERMISSIONS.DELETE_ACCOUNT_COLLAB),
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

const shouldShowPagination = computed(() =>
  !isLoading.value && state.totalItems,
)

const isAddUserButtonVisible = computed(() =>
  currentEntityId !== undefined && isMounted.value && isCollab.value,
)

const getQueryParams = () => ({
  pageNumber: state.currentPage,
  pageSize: state.limit,
  search: state.search,
  'sorting.field': state.sorting.field,
  'sorting.descending': state.sorting.descending,
})

const emit = defineEmits<{
  'accessSwitched': [Collab]
}>()

const handleChange = (row: any) => {
  const collab = toRaw(row) as Collab
  if (collab) {
    emit('accessSwitched', collab)
  }
}

const fetchCollaborators = async () => {
  if (!currentEntityId) {
    return
  }

  const queryParamsWithoutUndefined = removeFalsyValues(getQueryParams())
  const searchParams = new URLSearchParams(queryParamsWithoutUndefined)

  isLoading.value = true

  try {
    const {
      items,
      currentPage,
      totalPage,
      totalItems,
    } = await getCollaboratorsByIdEntity(currentEntityId, searchParams)
    collabs.value = items
    state.currentPage = currentPage
    state.totalPages = totalPage
    state.totalItems = totalItems
  } catch (error) {
    logger.error(error)
  }

  isLoading.value = false
}

onMounted(async () => {
  isMounted.value = true
  await fetchCollaborators()
})

watch(() => [
  state.currentPage,
  state.limit,
  state.search,
  state.sorting.field,
  state.sorting.descending,
], async () => {
  await fetchCollaborators()
})
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
.user-collabs {
  &__search-bar {
    width: 100%;
  }
}
.collab-table {
  .current-row > td:first-child {
    border-left: 4px solid var(--p-jungle-400);

    .cell {
      padding-left: 0.8rem;
    }
  }

  p {
    color: var(--p-gray-900);
  }
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

