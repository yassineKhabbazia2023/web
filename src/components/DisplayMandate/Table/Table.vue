<template>
  <PTable
    :pData="mandateCollection"
    pStripe
    :emptyText="t('no-data')"
    class="padding-left--6 padding-right--6"
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
          <PToolbox :pElements="actionsBuilder(scope.row.statusCode)">
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
        no-data: 'Aucun résultats'
</i18n>

<script setup lang='ts'>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PToolboxItemProps } from '@kpmg/styleguide'
import Tag from '@/components/Common/Tag'
import {
  PTable,
  PTableColumn,
  PToolbox,
  PButton,
  PIcon,
  PIThreeDots
} from '@kpmg/styleguide'
import { dateFormatter } from '@/helpers/utils'
import type { TableProps } from './Table'
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

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
      disabled: false,
      pActionName: 'cancel-telecollection',
      pState: 'danger'
    }
  ]
}
</script>

