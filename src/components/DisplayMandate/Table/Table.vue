<template>
  <PTable
    :pData="mandateCollection"
    pStripe
    :emptyText="t('no-data')"
    class="padding-left--6 padding-right--6"
    @sort-change="sortColumnChange"
  >
    <template v-for="({ label, prop, sortable }, index) in tableHead">
      <PTableColumn
        v-if="label === 'Actions'"
        :label="label"
        :prop="prop"
        :sortable="sortable"
        :key="prop"
      >
        <template #default="scope">
          <PToolbox
            :pElements="actionsBuilder(scope.row.statusCode)"
            @p-toolbox-item-clicked="actionClicked($event, scope.row)">
            <PButton pType="generic">
              <PIcon>
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
      >
        <template #default="scope">
          <Tag :status="scope.row.statusCode" />
        </template>
      </PTableColumn>
      <PTableColumn
        v-else
        :label="label"
        :prop="prop"
        :sortable="sortable"
        :key="index"
      />
    </template>
  </PTable>
  <PDialog
      v-model="pDialogControl.dialogVisible"
      :pWidth="pDialogControl.dialogWidth"
      :pModal="pDialogControl.dialogModal"
      :pCenter="pDialogControl.dialogCenter"
      :pBeforeClose="closeTerminateMandatePopup"
      :dialogCloseOnClickModal="pDialogControl.dialogCloseOnClickModal"
      :dialogCloseOnPressEscape="pDialogControl.dialogCloseOnPressEscape"
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
    fr-FR:
        ibs-code: 'Code IBS'
        company-name: 'Raison sociale'
        account-number: 'N° de compte'
        bank: 'Banque'
        created-on: 'Créé le'
        modified-on: 'Modifié le'
        status: 'Statut'
        download-signed-mandate: 'Télécharger le mandate signé'
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
</i18n>

<script setup lang='ts'>
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PToolboxItemProps } from '@kpmg/styleguide'
import Tag from '@/components/Common/Tag'
import {
  PTable,
  PTableColumn,
  PToolbox,
  PButton,
  PIcon,
  PIThreeDots,
  PDialog,
  PAlert
} from '@kpmg/styleguide'
import { dateFormatter, downloadFile } from '@/helpers/utils'
import type { TableProps, ActionEvent } from './Table'
import {
  downloadUnsignedMandate,
  downloadSignedMandate,
  terminateMandate
} from '@/services/mandate'

declare let window: any

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits(['sort-column-change'])
const pDialogControl = reactive({
  dialogVisible: false,
  dialogWidth: '40%',
  dialogModal: true,
  dialogCenter: false,
  dialogShowClose: true,
  dialogCloseOnClickModal: false,
  dialogCloseOnPressEscape: true,
  dialogCustomClass: 'my-dialog-class'
})

const accountNumberRef = ref<string>('')
const companyNameRef = ref<string>('')
const mandateIdRef = ref<string>('')

const props = defineProps<TableProps>()
const dataFormatter = (data: any) =>
  data.map(
    ({
      id,
      erpId,
      companyName,
      accountNumber,
      bankName,
      creationDate,
      modificationDate,
      statusCode
    }: any) => ({
      id,
      erpId,
      companyName,
      accountNumber,
      bankName,
      creationDate: dateFormatter(creationDate),
      modificationDate: dateFormatter(modificationDate),
      statusCode: statusCode.toString()
    })
  )
const mandateCollection = computed(() => dataFormatter(props.data))
const tableHead = [
  { label: `${t('ibs-code')}`, prop: 'erpId', sortable: true },
  { label: `${t('company-name')}`, prop: 'companyName', sortable: true },
  {
    label: `${t('account-number')}`,
    prop: 'accountNumber',
    sortable: true
  },
  { label: `${t('bank')}`, prop: 'bankName', sortable: true },
  { label: `${t('created-on')}`, prop: 'creationDate', sortable: true },
  {
    label: `${t('modified-on')}`,
    prop: 'modificationDate',
    sortable: true
  },
  { label: `${t('status')}`, prop: 'statusCode', sortable: true },
  { label: 'Actions', sortable: false }
]
const actionsBuilder = (statusCode: string | number): PToolboxItemProps[] => {
  const statusCodeNumber = Number(statusCode)
  return [
    {
      pIconName: 'PIDownload',
      pValue: t('download-pre-filled-mandate'),
      disabled: statusCodeNumber !== 20,
      pActionName: 'download-pre-filled-mandate',
      pState: 'default'
    },
    {
      pIconName: 'PIUpload',
      pValue: t('submit-signed-mandate'),
      disabled: statusCodeNumber !== 20,
      pActionName: 'submit-signed-mandate',
      pState: 'default'
    },
    {
      pIconName: 'PIDownload',
      pValue: t('download-signed-mandate'),
      disabled: statusCodeNumber === 20 || statusCodeNumber === 50,
      pActionName: 'download-signed-mandate',
      pState: 'default'
    },
    {
      pIconName: 'PIXCircle',
      pValue: t('cancel-telecollection'),
      disabled: statusCodeNumber !== 40,
      pActionName: 'cancel-telecollection',
      pState: 'danger'
    }
  ]
}

const sortColumnChange = ({ order, prop }: any) => {
  const criteriaMapper: any = {
    erpId: 'ErpId',
    companyName: 'Name',
    accountNumber: 'AccountNumber',
    bankName: 'BankName',
    creationDate: 'CreationDate',
    modificationDate: 'ModificationDate',
    statusCode: 'Status'
  }
  emit('sort-column-change', {
    sortOrder: order === 'descending' ? 'Descending' : 'Ascending',
    sortCriteria: criteriaMapper[prop] || ''
  })
}

const saveFile = async (id: string, data: any, mandateType: string) => {
  try {
    if (window.showSaveFilePicker && 'showSaveFilePicker' in window) {
      const fileHandle = await window?.showSaveFilePicker({
        suggestedName: `${mandateType}-mandate-${id}.pdf`,
        types: [{
          description: 'PDF Document',
          accept: { 'application/pdf': ['.pdf'] }
        }]
      })

      const writableStream = await fileHandle.createWritable()
      await writableStream.write(data)
      await writableStream.close()
    } else {
      downloadFile(`${mandateType}-mandate-${id}.pdf`, data, window)
    }
  } catch (error) {
    console.error('Error downloading file:', error)
  }
}

const actionClicked = async (event: ActionEvent, { id, accountNumber, companyName }:
  { id: string, accountNumber: string, companyName: string }) => {
  const actions: Record<any, () => Promise<void>> = {
    'download-pre-filled-mandate': async () => {
      const { data } = await downloadUnsignedMandate(id)
      await saveFile(id, data, 'unsigned')
    },
    'download-signed-mandate': async () => {
      const { data } = await downloadSignedMandate(id)
      await saveFile(id, data, 'signed')
    },
    'cancel-telecollection': async () => {
      accountNumberRef.value = accountNumber
      companyNameRef.value = companyName
      mandateIdRef.value = id
      pDialogControl.dialogVisible = true
    }
  }
  try {
    await actions[event]()
  } catch (_) {
  }
}

const closeTerminateMandatePopup = () => {
  pDialogControl.dialogVisible = false
  accountNumberRef.value = ''
  companyNameRef.value = ''
}

const terminateMandateAction = async (mandateId: string) => {
  await terminateMandate(mandateId)
  closeTerminateMandatePopup()
}
</script>

