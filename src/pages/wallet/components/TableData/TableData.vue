<template>
  <PTable
    ref="selectedRow"
    :pData="props.data"
    highlightCurrentRow
    showOverflowTooltip
    pStripe
    tableLayout="fixed"
    class="wallet-table"
  >
    <PTableColumn
      pProp="isFavorite"
      :pWidth="54"
      :pShowOverflowTooltip="false"
      data
    >
      <template #default="scope">
        <PButton
          v-if="scope.row.isFavorite"
          @click.stop="handleAddFavorite(scope.row.accountId, !scope.row.isFavorite)"
          pType="white"
          pSize="small"
          pIconOnly
          data-testid="wallet-add-favorite"
        >
          <PIcon>
            <PIStarFill />
          </PIcon>
        </PButton>
        <PButton
          v-if="!scope.row.isFavorite"
          @click.stop="handleAddFavorite(scope.row.accountId, !scope.row.isFavorite)"
          pType="white"
          pSize="small"
          pIconOnly
          data-testid="wallet-remove-favorite"
        >
          <PIcon>
            <PIStar />
          </PIcon>
        </PButton>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('companyName')"
      pProp="name"
      pSortable
      pMinWidth="120px"
    >
      <template #default="scope">
        <div class="flex flex--align-items-center overflow-hidden">
          <PAvatar
            :pColor="scope.row.owner.avatarColor"
            pType="xsmall"
          >
            <PIcon>
              <PIPulse />
            </PIcon>
          </PAvatar>
          <a
            class="font-semibold margin-left--2 link text-color--persian-500 overflow-hidden text-overflow--ellipsis"
            @click="onToolboxItemClicked('access', scope.row)"
          >
            {{ scope.row.name }}
          </a>
        </div>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('folderID')"
      pProp="accountNumber"
      pSortable
    />
    <PTableColumn
      :pLabel="t('leader')"
      pProp="owner.lastName"
      pSortable
    >
      <template #default="scope">
        <div class="flex flex--align-items-center overflow-hidden">
          <PAvatar
            v-if="scope.row.owner.initials"
            class="margin-right--2"
            pColor="persian-gradient"
            pType="xsmall"
          >
            {{ scope.row.owner.initials }}
          </PAvatar>
          <div class="overflow-hidden text-overflow--ellipsis">
            <p class="text-capitalize overflow-hidden text-overflow--ellipsis">
              {{ scope.row.owner.firstName }}
              <span class="text-uppercase"> {{ scope.row.owner.lastName }}</span>
            </p>
          </div>
        </div>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('email')"
      pProp="owner.email"
      pSortable
    >
      <template #default="scope">
        <p class="overflow-hidden text-overflow--ellipsis">
          {{ scope.row.owner.email }}
        </p>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('city')"
      pProp="city"
      pSortable
    >
      <template #default="scope">
        <p class="text-capitalize overflow-hidden text-overflow--ellipsis">
          {{ scope.row.city }}
        </p>
      </template>
    </PTableColumn>
    <template v-if="isCollab">
      <PTableColumn
        :pLabel="t('hub')"
        pProp="hub"
        pSortable
      >
        <template #default="scope">
          <p class="text-capitalize overflow-hidden text-overflow--ellipsis">
            {{ scope.row.hub }}
          </p>
        </template>
      </PTableColumn>
      <PTableColumn
        :pLabel="t('status')"
        pProp="deploymentStatus.text"
        pSortable
      >
        <template #default="scope">
          <PTag
            :pContent="scope.row.deploymentStatus.text"
            :pColor="scope.row.deploymentStatus.color"
            :pIconLeft="scope.row.deploymentStatus.icon"
            pEffect="light"
          />
        </template>
      </PTableColumn>
    </template>
    <PTableColumn
      :pLabel="t('option')"
      :pWidth="80"
      pAlign="center"
    >
      <template #default="scope">
        <PToolbox
          trigger="click"
          :pElements="isCollab ? menuElementsCollaborator(scope.row.deploymentStatus.text) : menuClient"
          @p-toolbox-item-clicked="$event => onToolboxItemClicked($event, scope.row)"
        >
          <PButton
            pType="white"
            pSize="small"
            pIconOnly
          >
            <PIcon>
              <PIThreeDots />
            </PIcon>
          </PButton>
        </PToolbox>
      </template>
    </PTableColumn>
    <PTableColumn
      v-if="isCollab"
      pWidth="46"
      :pShowOverflowTooltip="false"
    >
      <template #default="scope">
        <PCheckbox
          :disabled="false"
          @change="onSelectedFolder(scope.row)"
        />
      </template>
    </PTableColumn>
  </PTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  PAvatar,
  PButton,
  PIcon,
  PIPulse,
  PIStar,
  PIStarFill,
  PIThreeDots,
  PTag,
  PTable,
  PTableColumn,
  PToolbox,
  PICheck,
  PCheckbox,
  PIExclamationTriangle,
  PNotification,
  type PToolboxItemProps,
} from '@kpmg/styleguide'
import {
  onMounted,
  ref,
  toRaw,
  watch,
} from 'vue'
import type { ElTable } from 'element-plus'
import { storeToRefs } from 'pinia'
import { type Entity, commonApi, commonStore } from '@kpmg/common'
import type { TableDataProps, Row } from './types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = withDefaults(defineProps<TableDataProps>(), {
  data: [],
  handleAddFavorite: () => {},
})

const menuToDeployElements : PToolboxItemProps[] = [
  {
    pIconName: 'PIArrowUpCircle',
    pValue: t('deployThisFolder'),
    pActionName: 'deploy',
    pState: 'default',
  },
  {
    pIconName: 'PIFolder',
    pValue: t('accessThisFolder'),
    pActionName: 'access',
    pState: 'default',
  },
]

const menuInProgressElements : PToolboxItemProps[] = [
  {
    pIconName: 'PISend',
    pValue: t('resendActivationEmail'),
    pActionName: 'resendActivationEmail',
    pState: 'default',
  },
  {
    pIconName: 'PIFolder',
    pValue: t('accessThisFolder'),
    pActionName: 'access',
    pState: 'default',
  },
]

const menuConnectedElements : PToolboxItemProps[] = [
  {
    pIconName: 'PIFolder',
    pValue: t('accessThisFolder'),
    pActionName: 'access',
    pState: 'default',
  },
]
const menuClient : PToolboxItemProps[] = [
  {
    pIconName: 'PIPeople',
    pValue: t('users'),
    pActionName: 'users',
    pState: 'default',
  },
  {
    pIconName: 'PIFolder',
    pValue: t('info'),
    pActionName: 'info',
    pState: 'default',
  },
  {
    pIconName: 'PICalculatorEuro',
    pValue: t('invoices'),
    pActionName: 'invoices',
    pState: 'default',
  },
]

const menuElementsCollaborator = (status : string) => {
  return status === t('toDeploy')
    ? menuToDeployElements
    : (status === t('inProgress') ? menuInProgressElements : menuConnectedElements)
}

const userStore = commonStore()
const { defaultEntity } = storeToRefs(userStore)
const { isCollab } = storeToRefs(userStore)

const selectedRow = ref<InstanceType<typeof ElTable>>()

const emit = defineEmits<{
  'click-deploy': [number, string, string]
  access: [string]
  selectedFolder: [string]
}>()

const handleRowSelectedChange = (row: any) => {
  const rowValues = toRaw(row)
  if (rowValues) {
    const { name, accountId, accountNumber }: Row = rowValues
    // color is temporarily hard-coded
    const defaultEntity: Entity = {
      legalName: name,
      accountId,
      color: 'persian',
      accountNumber,
    }

    localStorage.setItem('selected-entity', JSON.stringify(defaultEntity))
    userStore.$patch({
      user: {
        entities: {
          default: defaultEntity,
        },
      },
    })
  }
}

const selectRowWhenTableFullyLoaded = (row: any) => {
  setTimeout(() => {
    const tableInstance =
      selectedRow.value?.$refs.table as InstanceType<typeof ElTable>
    tableInstance?.setCurrentRow(row)
  }, 250)
}

onMounted(() => {
  const firstRow = props.data[0]
  selectRowWhenTableFullyLoaded(firstRow)
})

watch(() => props.data, () => {
  const rowToSelect = props.data
    .find(({ accountId }: Row) => accountId === defaultEntity.value?.accountId)
  selectRowWhenTableFullyLoaded(rowToSelect)
})

const notifOnError = (companyName: string) => {
  PNotification({
    message: t('resendMailErrorMessage') + companyName,
    icon: PIExclamationTriangle,
    customClass: 'error',
    showClose: true,
    position: 'bottom-right',
  })
}

const resendActivationEmail = async (accountId: string, companyName: string) => {
  const contactId = userStore.user?.id
  const url = `/Activation/Invite?accountId=${accountId}&contactId=${contactId}`
  try {
    const { status } = await commonApi().onboarding.post(url)
    if (status === 200) {
      PNotification({
        message: t('resendMailSuccessMessageFirst') + companyName + t('resendMailSuccessMessageSecond'),
        icon: PICheck,
        showClose: true,
        customClass: 'success',
        position: 'bottom-right',
      })
    } else {
      notifOnError(companyName)
    }
  } catch {
    notifOnError(companyName)
  }
}

const onToolboxItemClicked = (action: string, row: any) => {
  const { accountId, name, accountNumber } = row

  if (action === 'deploy') {
    emit('click-deploy', accountId ?? 5, accountNumber, name)
  } else if (action === 'resendActivationEmail') {
    resendActivationEmail(accountId, name)
  } else if (action === 'access') {
    handleRowSelectedChange(row)
    emit('access', accountId)
  }
}

const onSelectedFolder = (row: any) => {
  const { accountId } = row
  emit('selectedFolder', accountId)
}
</script>

<style lang="scss">
.wallet-table {
  .el-table__body {
    .el-table__row {
      .el-table__cell {
        &:nth-of-type(-n+5) {
          &:hover {
            cursor: pointer;
          }
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
}
</style>

<i18n lang="yaml">
en-US:
  companyName: 'Company name'
  folderID: 'Folder ID'
  leader: 'Leader'
  city: 'City'
  email: 'Email'
  hub: 'Hub'
  status: 'Status'
  option: 'Options'
  deployThisFolder: 'Deploy this folder'
  accessThisFolder: 'Access this folder'
  resendActivationEmail: 'Resend activation email'
  toDeploy: 'To Deploy'
  inProgress: 'In progress'
  resendMailErrorMessage: 'A problem occurred while sending the activation email for '
  resendMailSuccessMessageFirst: 'A new activation email for '
  resendMailSuccessMessageSecond: ' has been sent successfully.'
  users: 'Users'
  info: 'Information'
  invoices: 'KPMG Invoices'
fr-FR:
  companyName: 'Nom de la société'
  folderID: 'ID Dossier'
  leader: 'Dirigeant'
  city: 'Ville'
  email: 'Mail'
  hub: 'Hub'
  status: 'Statut'
  option: 'Options'
  deployThisFolder: 'Déployer ce dossier'
  accessThisFolder: 'Accéder au dossier'
  resendActivationEmail: "Relancer le mail d'activation"
  toDeploy: 'A déployer'
  inProgress: 'En cours'
  resendMailErrorMessage: "Un problème est survenu lors de l'envoie du mail d'activation pour "
  resendMailSuccessMessageFirst: "Un nouveau mail d'activation pour "
  resendMailSuccessMessageSecond: ' a bien été envoyé.'
  users: 'Utilisateurs'
  info: 'Informations'
  invoices: 'Factures KPMG'
</i18n>
