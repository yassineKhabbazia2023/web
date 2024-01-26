<template>
<PTable
  @current-change="handleRowSelectedChange"
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
    :pWidth="30"
  >
    <template #default="scope">
      <PIcon
        v-if="scope.row.isFavorite"
        @click.stop="handleAddFavorite(scope.row.id, !scope.row.isFavorite)"
        color="#5546FF"
        size="14px"
      >
        <PIStarFill />
      </PIcon>
      <PIcon
        v-if="!scope.row.isFavorite"
        @click.stop="handleAddFavorite(scope.row.id, !scope.row.isFavorite)"
        color="#5546FF"
        size="14px"
      >
        <PIStar />
      </PIcon>
    </template>
  </PTableColumn>
  <PTableColumn
    :pLabel="t('companyName')"
    pProp="name"
    pSortable
  >
    <template #default="scope">
      <div class="flex valign-center">
        <PAvatar
          :pColor="scope.row.owner.avatarColor"
          pType="xsmall"
        >
          <PIcon>
            <PIPulse />
          </PIcon>
        </PAvatar>
        <a
          class="font-semibold margin-left--2 link"
          @click="onToolboxItemClicked('access', scope.row)">
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
      <div class="flex valign-center">
        <PAvatar
          v-if="scope.row.owner.initials"
          class="margin-right--2"
          pColor="persian-gradient"
          pType="small"
        >
          {{ scope.row.owner.initials }}
        </PAvatar>
        <div>
          <p class="capitalize font-bold">
            {{ scope.row.owner.firstName }}
            <span class="uppercase"> {{ scope.row.owner.lastName }}</span>
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
      <p class="capitalize">
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
      <p class="capitalize">
        {{ scope.row.city }}
      </p>
    </template>
  </PTableColumn>
  <PTableColumn
    :pLabel="t('hub')"
    pProp="hub"
    pSortable
  >
    <template #default="scope">
      <p class="capitalize">
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
  <PTableColumn
    :pLabel="t('option')"
    :pWidth="80"
  >
    <template #default="scope">
      <PToolbox
        trigger="click"
        :pElements="menuElements(scope.row.deploymentStatus.text)"
        @p-toolbox-item-clicked="$event => onToolboxItemClicked($event, scope.row)"
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
  <PTableColumn
    pWidth="50"
    :pShowOverflowTooltip="false"
  >
    <template #default>
      <PCheckbox :disabled="false"/>
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
  type PToolboxItemProps
} from '@kpmg/styleguide'
import {
  onMounted,
  ref,
  toRaw,
  watch
} from 'vue'
import { ElTable } from 'element-plus'
import { storeToRefs } from 'pinia'
import { commonApi, commonStore } from '@kpmg/common'
import type { Props, Row } from './types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const props = withDefaults(defineProps<Props>(), {
  data: [],
  handleAddFavorite: () => {}
})

const menuToDeployElements : PToolboxItemProps[] = [
  {
    pIconName: 'PIArrowUpCircle',
    pValue: t('deployThisFolder'),
    pActionName: 'deploy',
    pState: 'default'
  },
  {
    pIconName: 'PIFolder',
    pValue: t('accessThisFolder'),
    pActionName: 'access',
    pState: 'default'
  }
]

const menuInProgressElements : PToolboxItemProps[] = [
  {
    pIconName: 'PISend',
    pValue: t('resendActivationEmail'),
    pActionName: 'resendActivationEmail',
    pState: 'default'
  },
  {
    pIconName: 'PIFolder',
    pValue: t('accessThisFolder'),
    pActionName: 'access',
    pState: 'default'
  }
]

const menuConnectedElements : PToolboxItemProps[] = [
  {
    pIconName: 'PIFolder',
    pValue: t('accessThisFolder'),
    pActionName: 'access',
    pState: 'default'
  }
]

const menuElements = (status : string) => {
  return status === t('toDeploy')
    ? menuToDeployElements
    : (status === t('inProgress') ? menuInProgressElements : menuConnectedElements)
}

const userStore = commonStore()
const { user } = storeToRefs(userStore)

const selectedRow = ref<InstanceType<typeof ElTable>>()

const emit = defineEmits<{
  clickDeploy: [string, string],
  access: [string]
}>()

const handleRowSelectedChange = (row: any) => {
  const rowValues = toRaw(row)
  if (rowValues) {
    const { name, id }: Row = rowValues
    const defaultEntity = {
      name,
      idAccount: id
    }

    userStore.$patch({
      user: {
        entities: {
          default: defaultEntity
        }
      }
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
  handleRowSelectedChange(firstRow)
})

watch(() => props.data, () => {
  const rowToSelect = props.data
    .find(({ id }: Row) => id === user.value?.entities.default?.idAccount)
  selectRowWhenTableFullyLoaded(rowToSelect)
})

const notifOnError = (companyName: string) => {
  PNotification({
    message: t('resendMailErrorMessage') + companyName,
    icon: PIExclamationTriangle,
    customClass: 'error',
    showClose: true,
    position: 'bottom-right'
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
        position: 'bottom-right'
      })
    } else {
      notifOnError(companyName)
    }
  } catch {
    notifOnError(companyName)
  }
}

const onToolboxItemClicked = async (action: string, row: any) => {
  const { id, name, accountNumber } = row

  if (action === 'deploy') {
    emit('clickDeploy', accountNumber, name)
  } else if (action === 'resendActivationEmail') {
    resendActivationEmail(id, name)
  } else if (action === 'access') {
    emit('access', id)
  }
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

<style lang="scss" scoped>
.flex {
  display: flex;
}

.valign-center {
  align-items: center;
}

.capitalize {
  &::first-letter {
    text-transform: capitalize;
  }
}

.uppercase {
  text-transform: uppercase;
}

.color-gray--500 {
  color: var(--el-color-neutral-gray-500);
}

.link {
  color: var(--el-color-primary);
}
</style>

<i18n lang="yaml">
en-US:
  companyName: 'Company name'
  folderID: 'IBS Code'
  leader: 'Leader'
  city: 'City'
  email: 'Email'
  hub: 'Hub'
  status: 'Status'
  option: 'Option'
  deployThisFolder: 'Deploy this folder'
  accessThisFolder: 'Access this folder'
  resendActivationEmail: 'Resend activation email'
  toDeploy: 'To Deploy'
  inProgress: 'In progress'
  resendMailErrorMessage: 'A problem occurred while sending the activation email for '
  resendMailSuccessMessageFirst: 'A new activation email for '
  resendMailSuccessMessageSecond: ' has been sent successfully.'
fr-FR:
  companyName: 'Nom de la société'
  folderID: 'Code IBS'
  leader: 'Dirigeant'
  city: 'Ville'
  email: 'Mail'
  hub: 'Hub'
  status: 'Statut'
  option: 'Option'
  deployThisFolder: 'Déployer ce dossier'
  accessThisFolder: 'Accéder au dossier'
  resendActivationEmail: "Relancer mail d'activation"
  toDeploy: 'A déployer'
  inProgress: 'En cours'
  resendMailErrorMessage: "Un problème est survenu lors de l'envoie du mail d'activation pour "
  resendMailSuccessMessageFirst: "Un nouveau mail d'activation pour "
  resendMailSuccessMessageSecond: ' a bien été envoyé.'
</i18n>
