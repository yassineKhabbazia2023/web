<template>
  <div>
    <PTable
      :pData="mandateCollection"
      pStripe
      :emptyText="t('no-data')"
      data-testid="mandate-table"
      @sort-change="sortColumnChange"
    >
      <template
        v-for="({ label, prop, sortable, width, dataTestId }, index) in tableHead"
        :key="index">
        <PTableColumn
          v-if="label === 'Actions'"
          :label="label"
          :prop="prop"
          :sortable="sortable"
          :key="prop"
          :width="width"
        >
          <template #default="scope">
            <PToolbox
              trigger="click"
              data-testid="mandate-actions-toolbox"
              :pElements="actionsBuilder(scope.row.statusCode, scope.row.jdcPartnership)"
              @p-toolbox-item-clicked="actionClicked($event, scope.row)">
              <PButton pType="generic">
                <PIcon color="#A4A4A4" size="14px">
                  <PIThreeDots />
                </PIcon>
              </PButton>
            </PToolbox>
          </template>
        </PTableColumn>
        <PTableColumn
          v-else-if="label === `${t('status')}`"
          :label="label"
          :prop="prop"
          :sortable="sortable"
          :key="label"
          :width="width"
        >
          <template #default="scope">
            <Tag v-if="scope.row.statusCode" :status="scope.row.statusCode" />
          </template>
        </PTableColumn>
        <PTableColumn
          v-else
          :prop="prop"
          :sortable="sortable"
          :key="index"
          :width="width"
        >
          <template #header>
            <span :data-testid="dataTestId">
              {{ label }}
            </span>
          </template>
        </PTableColumn>
      </template>
    </PTable>
  </div>
  <PDialog
    v-model="pDialogControl.dialogVisible"
    pWidth="420px"
    pModal
    :pCenter="false"
    :pBeforeClose="closeTerminateMandatePopup"
    :dialogCloseOnClickModal="false"
    dialogCloseOnPressEscape
    :pTitle="t('title-popup')"
  >
    <PAlert pType="warning" class="margin-bottom--2">
      {{ t('alert-popup') }}
    </PAlert>
    <template #footer>
      <div class="p-dialog__footer">
        <PButton
          pType="primary"
          pSize="small"
          pPlain
          :pRound="false"
          :pDisabled="false"
          :pLoading="false"
          @click="closeTerminateMandatePopup"
        >
          {{ t('cancel-popup') }}
        </PButton>
        <PButton
          pType="primary"
          pSize="small"
          :pPlain="false"
          :pRound="false"
          :pDisabled="false"
          :pLoading="false"
          @click="terminateMandateAction(mandateIdRef)"
          class="margin-left--2"
        >
          {{ t('terminate-mandate-popup') }}
        </PButton>
      </div>
    </template>
    <p class="p-dialog__text">
      {{ t('text-one-popup-part1') }}
      <strong>{{ accountNumberRef }}</strong>
      {{ t('text-one-popup-part2') }}
      <strong>{{ companyNameRef }}</strong>
      {{ t('text-one-popup-part3') }}
      <br/>
      <br/>
      {{ t('text-one-popup-part4') }}
    </p>
  </PDialog>
</template>

<script setup lang='ts'>
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PToolboxItemProps } from '@kpmg/styleguide'
import {
  PTable,
  PTableColumn,
  PToolbox,
  PButton,
  PIcon,
  PIThreeDots,
  PDialog,
  PAlert,
} from '@kpmg/styleguide'
import Tag from '@/components/Common/Tag'
import { dateFormatter, downloadFile, saveFileAs } from '@/helpers/utils'
import type { ListMandateProps, ActionEvent } from './ListMandateTypes'
import {
  downloadUnsignedMandate,
  downloadSignedMandate,
  uploadSignedMandate,
  terminateMandate,
} from '@/services/mandate'
import { showNotification } from '@/helpers/NotificationHelper'
import type { NotificationMessagesByType } from '@/helpers/NotificationHelperTypes'
import type { SearchMandateParams } from '@/services/mandate/ServiceMandateTypes'

declare let window: any

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{
  'refresh-mandate-collection': [Partial<SearchMandateParams>]
}>()

const pDialogControl = reactive({
  dialogVisible: false,
})

const accountNumberRef = ref<string>('')
const companyNameRef = ref<string>('')
const mandateIdRef = ref<string>('')

const props = defineProps<ListMandateProps>()
const dataFormatter = (data: any) =>
  data.map(
    ({
      id,
      erpId,
      companyName,
      accountNumber,
      bankName,
      jdcPartnership,
      creationDate,
      modificationDate,
      statusCode,
    }: any) => ({
      id,
      erpId,
      companyName,
      accountNumber,
      bankName,
      jdcPartnership,
      creationDate: dateFormatter(creationDate),
      modificationDate: dateFormatter(modificationDate),
      statusCode: statusCode.toString(),
    }),
  )
const mandateCollection = computed(() => dataFormatter(props.data))
const tableHead = [
  { label: `${t('ibs-code')}`, prop: 'erpId', sortable: true, width: '105' },
  { label: `${t('company-name')}`, prop: 'companyName', sortable: true, dataTestId: 'mandate-company-column' },
  {
    label: `${t('account-number')}`,
    prop: 'accountNumber',
    sortable: true,
    width: '120',
  },
  { label: `${t('bank')}`, prop: 'bankName', sortable: true, dataTestId: 'mandate-bank-column' },
  { label: `${t('created-on')}`, prop: 'creationDate', sortable: true, width: '105' },
  {
    label: `${t('modified-on')}`,
    prop: 'modificationDate',
    sortable: true,
    width: '105',
  },
  { label: `${t('status')}`, prop: 'statusCode', sortable: true, width: '105' },
  { label: 'Actions', sortable: false, width: '72' },
]
const actionsBuilder = (statusCode: string | number, jdcPartnership: string | number): PToolboxItemProps[] => {
  const statusCodeNumber = Number(statusCode)
  const jdcPartnershipNumber = Number(jdcPartnership)
  const actions: PToolboxItemProps[] = [
    {
      pIconName: 'PIDownload',
      pValue: t('download-pre-filled-mandate'),
      disabled: statusCodeNumber !== 20,
      pActionName: 'download-pre-filled-mandate',
      pState: 'default',
    },
    {
      pIconName: 'PIUpload',
      pValue: t('submit-signed-mandate'),
      disabled: statusCodeNumber !== 20,
      pActionName: 'submit-signed-mandate',
      pState: 'default',
    },
    {
      pIconName: 'PIXCircle',
      pValue: t('cancel-telecollection'),
      disabled: statusCodeNumber !== 40,
      pActionName: 'cancel-telecollection',
      pState: 'danger',
    },
  ]

  if (jdcPartnershipNumber !== 2) {
    actions.push({
      pIconName: 'PIDownload',
      pValue: t('download-signed-mandate'),
      disabled: [20, 50].includes(statusCodeNumber),
      pActionName: 'download-signed-mandate',
      pState: 'default',
    })
  }

  return actions
}

const sortColumnChange = ({ order, prop }: any) => {
  const criteriaMapper: any = {
    erpId: 'ErpId',
    companyName: 'Name',
    accountNumber: 'AccountNumber',
    bankName: 'BankName',
    creationDate: 'CreationDate',
    modificationDate: 'ModificationDate',
    statusCode: 'Status',
  }
  emitRefreshMandateCollection({
    sortOrder: order === 'descending' ? 'Descending' : 'Ascending',
    sortCriteria: criteriaMapper[prop] || '',
  })
}

function emitRefreshMandateCollection(params: Partial<SearchMandateParams>) {
  emit('refresh-mandate-collection', params)
}

const saveFile = async (id: string, data: any, mandateType: string) => {
  try {
    if ('showSaveFilePicker' in window) {
      try {
        await saveFileAs(id, data, mandateType)
      } catch (error) {
        if (error instanceof Error && error.message !== 'The user aborted a request.') {
          downloadFile(`${mandateType}-mandate-${id}.pdf`, data, window)
        }
      }
    } else {
      downloadFile(`${mandateType}-mandate-${id}.pdf`, data, window)
    }
  } catch (error) {
    console.error('Error downloading file:', error)
  }
}

const actionClicked = async (event: ActionEvent, { id, accountNumber, companyName }:
  { id: string, accountNumber: string, companyName: string }) => {
  const actions: Record<any, () => Promise<void> | void> = {
    'download-pre-filled-mandate': async () => {
      await downloadAndSaveMandate(downloadUnsignedMandate, id, 'unsigned')
    },
    'download-signed-mandate': async () => {
      await downloadAndSaveMandate(downloadSignedMandate, id, 'signed')
    },
    'submit-signed-mandate': () => {
      // Dynamically create a file input and set its attributes
      const fileUpload = document.createElement('input')
      fileUpload.type = 'file'
      fileUpload.style.display = 'none'
      fileUpload.accept = 'application/pdf'
      fileUpload.onchange = (event) => handleFileUpload(event, id) // Pass the mandateId directly
      document.body.appendChild(fileUpload) // Append the input to the body

      // Trigger the file input
      fileUpload.click()

      // Cleanup: remove the file input after use
      fileUpload.remove()
    },
    'cancel-telecollection': () => {
      accountNumberRef.value = accountNumber
      companyNameRef.value = companyName
      mandateIdRef.value = id
      pDialogControl.dialogVisible = true
    },
  }
  try {
    await actions[event]()
  } catch (error) {
    console.error(error)
  }
}

const handleFileUpload = async (event: any, id: string) => {
  const messages = getNotificationMessages('upload')
  const notification = showNotification(messages, 'loading')

  try {
    const filesCollection = event.target.files
    if (filesCollection.length > 0) {
      await uploadSignedMandate({ mandateId: id, file: filesCollection[0] })
    }
    showNotification(messages, 'success', notification)
  } catch (error) {
    console.error('Error in mandate upload ', error)
    showNotification(messages, 'error', notification)
  } finally {
    emitRefreshMandateCollection({
      currentPage: props.currentPage,
    })
  }
}

const closeTerminateMandatePopup = () => {
  pDialogControl.dialogVisible = false
  accountNumberRef.value = ''
  companyNameRef.value = ''
}

const terminateMandateAction = async (mandateId: string) => {
  try {
    await terminateMandate(mandateId)
    closeTerminateMandatePopup()
  } catch (error) {
    console.error('Error downloading file:', error)
  }
}

function getNotificationMessages(action: 'upload' | 'download'): NotificationMessagesByType {
  return {
    loading: t('notification.loading'),
    success: t('notification.success'),
    error: action === 'upload' ? t('notification.error') : t('notification.downloading-error'),
    downloading: t('notification.downloading'),
  }
}

const downloadAndSaveMandate = async (downloadFunction: any, id: string, mandateType: string) => {
  const messages = getNotificationMessages('download')
  const notification = showNotification(messages, 'downloading')
  try {
    const { data } = await downloadFunction(id)
    await saveFile(id, data, mandateType)
  } catch (error) {
    console.error('Error downloading mandate:', error)
    showNotification(messages, 'error', notification)
  } finally {
    notification.close()
  }
}
</script>

<i18n lang="yaml">
    en-US:
        ibs-code: 'IBS code'
        company-name: 'Company name'
        account-number: 'Account number'
        bank: 'Bank'
        created-on: 'Created on'
        modified-on: 'Modified on'
        status: 'Status'
        download-signed-mandate: 'Download signed mandate'
        download-pre-filled-mandate: 'Download pre-filled mandate'
        submit-signed-mandate: 'Submit the signed mandate'
        cancel-telecollection: 'Cancel telecollection'
        no-data: 'No data'
        title-popup: 'Cancel the collection'
        alert-popup: 'Warning! This action is irreversible.'
        text-one-popup-part1: "You are about to cancel the collection of bank flows
          for account No. "
        text-one-popup-part2: " for the "
        text-one-popup-part3: " file."
        text-one-popup-part4: 'This action is irreversible, you will no longer have access to
          the bank movements of this account.'
        cancel-popup: 'Cancel'
        terminate-mandate-popup: 'Terminate'
        notification:
          loading: 'The signed mandate is being transmitted...'
          success: 'The signed mandate has been submitted!'
          error: 'There was an error during transmission'
          downloading: 'The download is in preparation'
          downloading-error: 'There was an error during preparation'
    fr-FR:
        ibs-code: 'Code IBS'
        company-name: 'Raison sociale'
        account-number: 'N° de compte'
        bank: 'Banque'
        created-on: 'Créé le'
        modified-on: 'Modifié le'
        status: 'Statut'
        download-signed-mandate: 'Télécharger le mandat signé'
        download-pre-filled-mandate: 'Télécharger le mandat pré-rempli'
        submit-signed-mandate: 'Déposer le mandat signé'
        cancel-telecollection: 'Résilier la télécollecte'
        no-data: 'Aucun résultat'
        title-popup: 'Résilier la collecte'
        alert-popup: 'Attention ! Cette action est irréversible.'
        text-one-popup-part1: "Vous êtes sur le point de résilier la collecte des flux
          bancaires pour le compte N° "
        text-one-popup-part2: " pour le dossier "
        text-one-popup-part3: "."
        text-one-popup-part4: 'Cette action est irréversible, vous n’aurez plus accès aux
          mouvements bancaires de ce compte.'
        cancel-popup: 'Annuler'
        terminate-mandate-popup: 'Résilier'
        notification:
          loading: 'Le mandat signé est en cours de transmission...'
          success: 'Le mandat signé a bien été déposé !'
          error: 'Il y a eu une erreur lors de la transmission'
          downloading: 'Le téléchargement est en cours de préparation'
          downloading-error: "Il y'a eu une erreur lors de la préparation"
</i18n>
