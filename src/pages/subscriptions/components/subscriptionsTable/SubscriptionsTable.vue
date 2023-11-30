<template>
  <PTable
    :pStripe="tableInputs.striped"
    :pData="requests"
    data-ut="table"
  >
    <PTableColumn :label="t('dateRequest')">
      <template #default="scope">
        <PText
          :pContent="new Date(scope.row.creationDate).toLocaleString()"
          pType="primary"
          :disabled="false"
          :selected="false"
        />
      </template>
    </PTableColumn>
    <PTableColumn :label="t('folderId')">
      <template #default="scope">
        <PText
          :pContent="scope.row.account?.accountNumber"
          pType="primary"
          :disabled="false"
          :selected="false"
        />
      </template>
    </PTableColumn>
    <PTableColumn :label="t('legalName')">
      <template #default="scope">
        <PText
          :pContent="scope.row.account?.accountLabel"
          pType="primary"
          :disabled="false"
          :selected="false"
        />
      </template>
    </PTableColumn>
    <PTableColumn :label="t('principalContact')">
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
    <PTableColumn :label="t('requester')">
      <template #default="scope">
        <PText
          :pContent="scope.row.applicant"
          pType="primary"
          :disabled="false"
          :selected="false"
        />
      </template>
    </PTableColumn>
    <PTableColumn :label="t('offer')">
      <template #default="scope">
        <PText
          :pContent="scope.row.offer?.offerLabel"
          pType="primary"
          :disabled="false"
          :selected="false"
        />
      </template>
    </PTableColumn>
    <PTableColumn :label="t('status')">
      <template #default="scope">
        <PTag
          :pColor="scope.row.statusCode === 'Validated' ? 'success': 'info'"
          pEffect="light"
          :pContent="formatStatus(scope.row.statusCode)"
        />
      </template>
    </PTableColumn>
    <PTableColumn width="200">
      <template #default="scope">
        <PButton
          data-ut="validateButton"
          pType="primary"
          pSize="default"
          @click="validateSubscription(scope.row.subscriptionId)"
          :pLoading="scope.row.subscriptionId === clickedRow ? !isLoading : isLoading"
        >
          {{ t('validate') }}
        </PButton>
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
    dateRequest: 'Request date'
    validate: 'Validate request'
    toValidate: 'To validate'
  fr-FR:
    folderId: 'ID Dossier'
    legalName: 'Raison sociale'
    principalContact: 'Contact principal'
    requester: 'Demandeur'
    offer: 'Offre'
    status: 'Statut'
    dateRequest: 'Date de la demande'
    validate: 'Valider la demande'
    toValidate: 'A valider'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, reactive, ref } from 'vue'
import { PButton, PDoubleText, PTable, PTableColumn, PTag, PText } from '@kpmg/styleguide'
import { fetchSubscriptionRequests, validateSubscriptionRequest } from '../../SubscriptionsServices'
import type { SubscriptionRequest, User } from '../../SubscriptionsTypes'

const tableInputs = reactive({
  striped: true,
  sortable: true,
  selectable: false
})

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const requests = ref<SubscriptionRequest[]>([])

const fetchSubscriptions = async () => {
  requests.value = await fetchSubscriptionRequests()
}

const formatStatus = (status: string) => {
  return status === 'Pending' ? t('toValidate') : status
}

const clickedRow = ref('')
const isLoading = ref(false)

const validateSubscription = async (subscriptionId: string) => {
  if (subscriptionId) {
    clickedRow.value = subscriptionId
    await validateSubscriptionRequest(subscriptionId)
    await fetchSubscriptions()
  }
}

const profile = (users: User[]) =>
  users[0]?.firstName?.slice(0, 1)?.toUpperCase() +
  users[0]?.lastName?.slice(0, 1)?.toUpperCase()

const title = (users: User[]) =>
  `${users[0]?.firstName} ${users[0]?.lastName}`

const content = (users: User[]) => users[0]?.email

onMounted(async () => {
  await fetchSubscriptions()
})
</script>
