<template>
  <PDrawer
    v-model="isVisible"
    pSize="50%"
    :pTitle="drawerTitle"
    data-testid="bulk-customer-relation-drawer"
    @close-drawer-button="closeDrawer"
    @close="closeDrawer"
  >
    <p>{{ description }}</p>
    <p class="margin-top--3 margin-bottom--5">
      {{ t(`${I18N_KEY}.verifySelection`) }}
    </p>

    <section aria-labelledby="selected-folders-title">
      <div
        class="
          flex
          flex--align-items-center
          flex--justify-content-space-between
          margin-bottom--3
        "
      >
        <div class="flex flex--align-items-center">
          <PIcon pName="infoCircle" class="margin-right--2" />
          <p id="selected-folders-title" class="font-semibold">
            {{ t(`${I18N_KEY}.selectedFolders`) }}
          </p>
        </div>
        <PButton
          pType="default"
          pSize="small"
          data-testid="bulk-customer-relation-toggle-folders"
          @click="isFolderListExpanded = isFolderListExpanded === false"
        >
          {{ t(`${I18N_KEY}.${isFolderListExpanded ? 'close' : 'open'}`) }}
          <PIcon
            :pName="isFolderListExpanded ? 'chevronUp' : 'chevronDown'"
            class="margin-left--2"
          />
        </PButton>
      </div>

      <PTable
        v-show="isFolderListExpanded"
        :pData="selectedFolders"
        :pCellStyle="getFolderCellStyle"
      >
        <PTableColumn
          :pLabel="t(`${I18N_KEY}.folderName`)"
          pProp="name"
          pSortable
        >
          <template #default="scope">
            <div
              class="flex flex--align-items-center"
              :class="{ 'opacity--50': isAlreadyInTargetStatus(scope.row) }"
            >
              <PEntityAvatar
                :pAccountType="AccountType.REGULAR"
                :pColor="scope.row.avatarColor"
                pType="xsmall"
              />
              <span class="font-semibold margin-left--2">
                {{ scope.row.name }}
              </span>
            </div>
          </template>
        </PTableColumn>
        <PTableColumn
          :pLabel="t(`${I18N_KEY}.customerCode`)"
          pProp="accountNumber"
          :pWidth="220"
          pAlign="right"
          pHeaderAlign="right"
          pSortable
        >
          <template #default="scope">
            <span :class="{ 'opacity--50': isAlreadyInTargetStatus(scope.row) }">
              {{ scope.row.accountNumber }}
            </span>
          </template>
        </PTableColumn>
        <PTableColumn pWidth="48" pAlign="center">
          <template #default="scope">
            <PIcon
              v-if="isAlreadyInTargetStatus(scope.row)"
              pName="check"
              class="opacity--50"
            />
            <PCheckbox
              v-else
              :model-value="selectedActionableFolderIdSet.has(scope.row.id)"
              data-testid="bulk-customer-relation-folder-checkbox"
              @update:model-value="handleFolderSelection(scope.row.id, $event)"
            />
          </template>
        </PTableColumn>
      </PTable>
    </section>

    <PAlert
      pType="main"
      pIconName="infoCircle"
      class="margin-top--5"
    >
      <span class="font-semibold">{{ informationMessage }}</span>
    </PAlert>

    <template #footer>
      <PDrawerActions
        :pBackCTA="backCTA"
        :pPrimaryCTA="primaryCTA"
        @click-back-cta="closeDrawer"
        @click-primary-cta="updateSelectedFoldersCustomerRelation"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import {
  PAlert,
  PButton,
  PCheckbox,
  PDrawer,
  PDrawerActions,
  PEntityAvatar,
  PIcon,
  PTable,
  PTableColumn,
} from '@pulse/styleguide/components'
import type { PDrawerActionButton } from '@pulse/styleguide/types'
import { AccountType } from '@pulse/common/enums'
import type { BulkCustomerRelationDrawerProps } from './bulk-customer-relation-drawer.types'
import { BulkCustomerRelationManager } from './bulk-customer-relation.manager'
import { useBulkCustomerRelationDrawer } from './bulk-customer-relation-drawer.composable'

const I18N_KEY = 'entities.bulkCustomerRelationDrawer'

const props = defineProps<BulkCustomerRelationDrawerProps>()
const emit = defineEmits<{
  updated: [succeededAccountIds: number[]]
}>()

const isVisible = defineModel<boolean>({ required: true })
const isLoading = ref(false)
const {
  getFolderCellStyle,
  handleFolderSelection,
  isAlreadyInTargetStatus,
  isFolderListExpanded,
  selectedActionableFolderIds,
  selectedActionableFolderIdSet,
} = useBulkCustomerRelationDrawer(props)
const { t } = useI18n()

const drawerTitle = computed(() => t(
  `${I18N_KEY}.${props.targetCustomerRelationStatus === true ? 'declareTitle' : 'removeTitle'}`,
))

const description = computed(() => t(
  `${I18N_KEY}.${props.targetCustomerRelationStatus === true ? 'declareDescription' : 'removeDescription'}`,
))

const informationMessage = computed(() => t(
  `${I18N_KEY}.${props.targetCustomerRelationStatus === true ? 'alreadyDeclaredInformation' : 'alreadyRemovedInformation'}`,
))

const backCTA = computed<PDrawerActionButton>(() => ({
  pLabel: t(`${I18N_KEY}.cancel`),
  pDisabled: isLoading.value,
  pTestId: 'bulk-customer-relation-cancel-button',
}))

const primaryCTA = computed<PDrawerActionButton>(() => ({
  pLabel: t(`${I18N_KEY}.confirm`),
  pDisabled: selectedActionableFolderIds.value.length === 0,
  pLoading: isLoading.value,
  pTestId: 'bulk-customer-relation-confirm-button',
}))

function closeDrawer() {
  isVisible.value = false
}

async function updateSelectedFoldersCustomerRelation() {
  if (selectedActionableFolderIds.value.length === 0) {
    return
  }

  isLoading.value = true
  try {
    const response = await BulkCustomerRelationManager.updateSelectedFolders(
      selectedActionableFolderIds.value,
      props.targetCustomerRelationStatus,
    )
    const succeededCount = response.succeeded.length
    const totalCount = response.succeeded.length + response.failed.length
    const failedCount = response.failed.length
    const notification = BulkCustomerRelationManager.getNotification(response, {
      success: t(`${I18N_KEY}.success`),
      partialSuccess: t(`${I18N_KEY}.partialSuccess`, {
        succeededCount,
        folderLabel: t(`${I18N_KEY}.folderLabel`, succeededCount),
        totalCount,
        remainingMessage: t(`${I18N_KEY}.remainingFailure`, failedCount),
      }),
      failure: t(`${I18N_KEY}.failure`),
    })

    displayNotification(notification.type, notification.message)

    if (succeededCount > 0) {
      emit('updated', response.succeeded.map(({ accountId }) => accountId))
    }
  } catch (error) {
    logger.error('Unable to update customer relation on selected folders', error)
    displayNotification('error', t(`${I18N_KEY}.failure`))
  } finally {
    isLoading.value = false
  }
}
</script>
