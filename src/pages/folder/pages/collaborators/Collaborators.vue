<template>
  <div class="margin-top--6">
    <AddCollaboratorsDrawer
      v-if="currentEntityId && isAddCollaboratorsDrawerOpened"
      v-model="isAddCollaboratorsDrawerOpened"
      :entityId="currentEntityId"
      @refresh-collaborators-list="fetchCollaborators"
    />

    <DrawerCollabDetails
      v-if="isCollabDetailsDrawerOpened"
      v-model="isCollabDetailsDrawerOpened"
      :hasDrawerOpened="isCollabDetailsDrawerOpened"
      :rowData="rowDataForDrawers"
    />

    <!-- the target for this teleport is the page folder, here src/pages/folder/Folder.vue -->
    <Teleport
      v-if="shouldShowAddButton"
      to=".folder__teleported-content"
    >
      <PButton
        @click="isAddCollaboratorsDrawerOpened = true"
        pType="primary"
        pSize="small"
        data-testid="add-collaborator-button"
      >
        {{ t('addCollaborator') }}
      </PButton>
    </Teleport>

    <div class="margin-bottom--6">
      <FormSearch @search-value-submitted="handleSearchValueSubmitted" />
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
        @current-change="handleChange"
        @sort-change="handleSortChange"
        ref="selectedRow"
        :pData="collabs"
        showOverflowTooltip
        pStripe
        tableLayout="fixed"
        class="collab-table"
      >
        <PTableColumn
          :pLabel="t('collaboratorName')"
          pSortable="custom"
          pProp="name"
        >
          <template #default="scope">
            <div class="flex flex--align-items-center">
              <PAvatar
                class="margin-right--2"
                pColor="persian-gradient"
                pType="small"
              >
                {{ getInitials(scope.row.firstName,scope.row.lastName) }}
              </PAvatar>
              <div>
                <p class="line-height--120">
                  <span class="text-capitalize">{{ scope.row.firstName }}&nbsp;</span>
                  <span class="text-uppercase"> {{ scope.row.lastName }}</span>
                </p>
              </div>
            </div>
          </template>
        </PTableColumn>
        <PTableColumn
          :pLabel="t('collaboratorEmail')"
          pProp="email"
          pSortable="custom"
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
        >
          <template #default="scope">
            <p>
              <span class="text-capitalize"> {{t('collaboratorOffice')}} &nbsp;</span>
              <span class="text-uppercase"> {{ scope.row.office }} </span>
            </p>
          </template>
        </PTableColumn>
        <PTableColumn
          v-if="toolboxItems.length > 0"
          :pLabel="t('action')"
          :pWidth="100"
          data-testid="collaborators-action"
        >
          <template #default="scope">
            <PToolbox
              @p-toolbox-item-clicked="$event => handleToolboxItemClick($event, scope.row)"
              trigger="click"
              popperClass="toolbox-container"
              :pElements="toolboxItems"
              data-testid="toolbox-action"
            >
              <PButton
                pType="generic"
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

      <NoResult v-if="!collabs.length" />
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
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  PAvatar,
  PButton,
  PICheck,
  PIcon,
  PIExclamationTriangle,
  PIThreeDots,
  PLoader,
  PNotification,
  PPagination,
  PTable,
  PTableColumn,
  PToolbox,
  type PToolboxItemProps,
} from '@kpmg/styleguide'
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
import { commonStore, userPermissions } from '@kpmg/common'
import { PAGE_SIZES, PERMISSION_CODES } from '@/constants'
import type { Collab } from './types'
import type { Account } from '@/services/account/accountTypes'
import type { Contact } from '@/services/contact/contactTypes'
import { getContactById } from '@/services/contact'
import { getCollaboratorsByIdEntity } from '@/services/wallet'
import { deleteContactFromAccount } from '@/services/account'
import { getInitials, removeFalsyValues } from '@/helper'
import NoResult from '@/common/components/NoResult'
import FormSearch from '@/common/components/FormSearch'
import DrawerCollabDetails from '@/common/components/DrawerCollabDetails'
import AddCollaboratorsDrawer from './components/AddCollaboratorDrawer'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const userStore = commonStore()
const { isCollab } = storeToRefs(userStore)
const { hasPermission } = userPermissions()

const isLoading = ref(false)
const isMounted = ref(false)
const collabs = ref<Collab[]>([])

const isAddCollaboratorsDrawerOpened = ref(false)
const isCollabDetailsDrawerOpened = ref(false)

const route = useRoute()
const currentEntityId = Number(route.params.id)

const selectedRow = ref<InstanceType<typeof ElTable>>()

const state: any = reactive({
  currentPage: 1,
  limit: 15,
  totalPages: undefined,
  totalItems: undefined,
  search: undefined,
  sort: undefined,
  order: undefined,
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
    console.error(error)
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
    icon: PICheck,
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
  })
}

const displayErrorNotificationRemovedCollaborator = () => {
  PNotification({
    message: t('collaboratorWasNotRemoved'),
    icon: PIExclamationTriangle,
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
    console.error(error)
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
  state.sort = prop
  state.order = order
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
        pIconName: 'PIPerson',
        pValue: t('collaboratorInformation'),
        pActionName: 'collaboratorInformation',
        pState: 'default',
        display: isCollab.value,
      },
      {
        pIconName: 'PITrash',
        pValue: t('removeCollaborator'),
        pActionName: 'removeCollaborator',
        pState: 'default',
        display: isCollab.value && hasPermission(PERMISSION_CODES.DELETE_COLLAB),
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

const shouldShowAddButton = computed(() =>
  currentEntityId !== undefined && isMounted.value && isCollab.value,
)

const getQueryParams = () => ({
  pageNumber: state.currentPage,
  pageSize: state.limit,
  search: state.search,
  'sorting.field': state.sort,
  'sorting.descending': state.order === 'descending',
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
  if (!currentEntityId) return

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
    console.error(error)
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
  state.sort,
  state.order,
], async () => {
  await fetchCollaborators()
})
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
.collab-table {
  .cell {
    padding-top: 0.8rem;
    padding-bottom: 0.8rem;
  }

  .el-table__body {
    .el-table__cell {
      height: 65px;

      &:nth-of-type(-n+5) {
        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .current-row > td:first-child {
    border-left: 4px solid var(--el-color-base-persian);

    .cell {
      padding-left: 0.8rem;
    }
  }

  p {
    color: var(--el-color-neutral-gray-900);
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

<style lang="scss" scoped>
.color-gray--900 {
  color: var(--el-color-neutral-gray-900);
}

.line-height--120 {
  line-height: 120%;
}
</style>

<i18n lang="yaml">
en-US:
  action: 'Action'
  collaboratorName: 'Collaborator'
  collaboratorEmail: 'E-mail'
  collaboratorFunction: 'Function'
  collaboratorOffice: 'Office'
  numberOfUsersPerPage: 'Number of collaborators per page'
  on: 'on'
  addCollaborator: 'Add collaborator'
  removeCollaborator: 'Remove collaborator'
  collaboratorInformation: 'Collaborator information'
  collaboratorHasBeenRemoved: 'The collaborator has been removed from the entity'
  collaboratorWasNotRemoved: 'The collaborator was not removed from the entity due to a technical error'
fr-FR:
  action: 'Action'
  collaboratorName: 'Collaborateur'
  collaboratorEmail: 'E-mail'
  collaboratorFunction: 'Fonction'
  collaboratorOffice: 'Bureau'
  numberOfUsersPerPage: 'Nombre collaborateurs par page'
  on: 'sur'
  addCollaborator: 'Ajouter un collaborateur'
  removeCollaborator: 'Retirer le collaborateur'
  collaboratorInformation: 'Informations du collaborateur'
  collaboratorHasBeenRemoved: "Le collaborateur a bien été retiré de l'entité"
  collaboratorWasNotRemoved: "Le collaborateur n'a pas été retiré de l'entité a cause d'une erreur technique"
</i18n>
