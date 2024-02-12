<template>
  <PTable
    pStripe
    :pData="requests"
    data-testid="table"
  >
    <PTableColumn :pLabel="t('dateRequest')">
      <template #default="scope">
        <PText
          :pContent="new Date(scope.row.creationDate).toLocaleString()"
          pType="primary"
          :disabled="false"
          :selected="false"
        />
      </template>
    </PTableColumn>
    <PTableColumn :pLabel="t('folderId')">
      <template #default="scope">
        <PText
          :pContent="scope.row.account?.accountNumber"
          pType="primary"
          :disabled="false"
          :selected="false"
        />
      </template>
    </PTableColumn>
    <PTableColumn :pLabel="t('legalName')">
      <template #default="scope">
        <PText
          :pContent="scope.row.account?.accountLabel"
          pType="primary"
          :disabled="false"
          :selected="false"
        />
      </template>
    </PTableColumn>
    <PTableColumn :pLabel="t('principalContact')">
      <template #default="scope">
        <PDoubleText
          :pTitle="title(scope.row.users)"
          :pContent="content(scope.row.users)"
          pType="primary"
          :pDisabled="false"
          :pSelected="false"
          :pProfile="profile(scope.row.users)"
        />
      </template>
    </PTableColumn>
    <PTableColumn :pLabel="t('requester')">
      <template #default="scope">
        <PText
          :pContent="scope.row.applicant"
          pType="primary"
          :disabled="false"
          :selected="false"
        />
      </template>
    </PTableColumn>
    <PTableColumn :pLabel="t('offer')">
      <template #default="scope">
        <PText
          :pContent="scope.row.offer?.offerLabel"
          pType="primary"
          :disabled="false"
          :selected="false"
        />
      </template>
    </PTableColumn>
    <PTableColumn :pLabel="t('status')">
      <template #default="scope">
        <PTag
          :pColor="
            scope.row.statusCode === SubscriptionStatusCode.VALIDATED
              ? 'success'
              : 'info'
          "
          pEffect="light"
          :pContent="formatStatus(scope.row.statusCode)"
        />
      </template>
    </PTableColumn>
    <PTableColumn :pLabel="t('options')" :pWidth="80">
      <template #default="scope">
        <PToolbox
          trigger="click"
          :pElements="requestMenu"
          data-testid="subscription-toolbox"
          @p-toolbox-item-clicked="($event: string) => onClickToolboxItem($event, scope.row)"
        >
          <PButton
            pType="white"
            pSize="small"
            :pLoading="
              scope.row.subscriptionId === clickedRow && isLoading
            "
            class="el-button--icon"
          >
            <PIcon>
              <PIThreeDots  />
            </PIcon>
          </PButton>
        </PToolbox>
      </template>
    </PTableColumn>
  </PTable>
</template>

<i18n lang="yaml">
en-US:
  folderId: 'Folder ID'
  legalName: 'Legal name'
  principalContact: 'Principal Contact'
  requester: 'Requester'
  offer: 'Offer'
  status: 'Status'
  options: 'Options'
  dateRequest: 'Request date'
  validate: 'Validate request'
  consult: 'Consult'
  toValidate: 'To validate'
fr-FR:
  folderId: 'ID Dossier'
  legalName: 'Raison sociale'
  principalContact: 'Contact principal'
  requester: 'Demandeur'
  offer: 'Offre'
  status: 'Statut'
  options: 'Options'
  dateRequest: 'Date de la demande'
  validate: 'Valider la demande'
  consult: 'Consulter'
  toValidate: 'A valider'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import {
  PButton,
  PDoubleText,
  PTable,
  PTableColumn,
  PToolbox,
  PIcon,
  PTag,
  PText,
  PIThreeDots,
  type PToolboxItemProps
} from '@kpmg/styleguide'
import {
  fetchSubscriptionRequests,
  validateSubscriptionRequest
} from '../../SubscriptionsServices'
import {
  SubscriptionStatusCode,
  type SubscriptionRequest,
  type User,
  type SubscriptionAccount
} from '../../SubscriptionsTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits<{
  consult: [SubscriptionAccount]
  validate: [string]
}>()

const requests = ref<SubscriptionRequest[]>([])
const clickedRow = ref('')
const isLoading = ref(false)
const requestMenu: PToolboxItemProps[] = [
  {
    pIconName: 'PIEye',
    pValue: t('consult'),
    pActionName: 'consult',
    pState: 'default'
  },
  {
    pIconName: 'PICheck',
    pValue: t('validate'),
    pActionName: 'validate',
    pState: 'default'
  }
]

const fetchSubscriptions = async () => {
  requests.value = await fetchSubscriptionRequests() ?? []
}

const formatStatus = (status: string) => {
  return status === SubscriptionStatusCode.PENDING ? t('toValidate') : status
}

const validateSubscription = async (subscriptionId: string) => {
  if (subscriptionId) {
    isLoading.value = true
    clickedRow.value = subscriptionId
    await validateSubscriptionRequest(subscriptionId)
    await fetchSubscriptions()
    isLoading.value = false
  }
}

const onClickToolboxItem = async (action: string, row: any) => {
  const { subscriptionId, account } = row

  if (action === 'consult') {
    emit('consult', account)
  } else if (action === 'validate') {
    await validateSubscription(subscriptionId)
  }
}

const profile = (users: User[]) =>
  users[0]?.firstName?.slice(0, 1)?.toUpperCase() +
  users[0]?.lastName?.slice(0, 1)?.toUpperCase()

const title = (users: User[]) => `${users[0]?.firstName} ${users[0]?.lastName}`

const content = (users: User[]) => users[0]?.email

onMounted(async () => {
  await fetchSubscriptions()
})
</script>
