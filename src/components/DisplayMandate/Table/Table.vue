<template>
  <PTable
    :pData="mandateCollection"
    pStripe
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
            <PButton type="generic">
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
    fr-FR:
        ibs-code: 'Code IBS'
        company-name: 'Raison sociale'
        account-number: 'N° de compte'
        bank: 'Banque'
        created-on: 'Créé le'
        modified-on: 'Modifié le'
        status: 'Statut'
</i18n>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import Tag from '@/components/Common/Tag'
import {
  PTable,
  PTableColumn,
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
      statusCode
    })
  )
const mandateCollection = dataFormatter(props.data)
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
/* const actionsBuilder = (statusCode: string | number) => {
  const statusCodeNumber = Number(statusCode)
  return [
    {
      iconName: 'PIDownload',
      value: t('download-pre-filled-mandate'),
      disabled: statusCodeNumber !== 20,
      actionName: 'download-pre-filled-mandate'
    },
    {
      iconName: 'PIUpload',
      value: t('submit-signed-mandate'),
      disabled: statusCodeNumber !== 20,
      actionName: 'submit-signed-mandate'
    },
    {
      iconName: 'PIDownload',
      value: t('download-signed-mandate'),
      disabled: statusCodeNumber === 20 || statusCodeNumber === 50,
      actionName: 'download-signed-mandate'
    },
    {
      iconName: 'PIXCircle',
      value: t('cancel-telecollection'),
      disabled: false,
      actionName: 'cancel-telecollection'
    }
  ]
} */
</script>

