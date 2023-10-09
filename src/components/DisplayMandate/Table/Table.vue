<template>
  <PTable
    :data="mandateCollection"
    stripe
    class="padding-left--6 padding-right--6"
  >
    <template
v-for="({ label, prop, sortable }, index) in [
        { label: `${t('ibs-code')}`, prop: 'erpId', sortable: true },
        { label: `${t('company-name')}`, prop: 'companyName', sortable: true },
        { label: `${t('account-number')}`, prop: 'accountNumber', sortable: true },
        { label: `${t('bank')}`, prop: 'bankName', sortable: true },
        { label: `${t('created-on')}`, prop: 'creationDate', sortable: true },
        { label: `${t('modified-on')}`, prop: 'modificationDate', sortable: true },
        { label: `${t('status')}`, prop: 'statusCode', sortable: true },
        { label: 'Actions', sortable: false }
      ]"
    >
      {{label}}
      <PTableColumn
        v-if="label !== `${t('status')}`"
        :label="label"
        :prop="prop"
        :sortable="sortable"
        :key="label"
      />
      <PTableColumn
        v-else
        :label="label"
        :prop="prop"
        :sortable="sortable"
        :key="index"
      >
        <template #default="scope">
        <Tag :status="scope.row.statusCode"/>
        </template>
      </PTableColumn>
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
import { PTable, PTableColumn } from '@kpmg/styleguide'
import { dateFormatter } from '@/helpers/utils'
import type { TableProps } from './Table'
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const props = defineProps<TableProps>()
const dataFormatter = (data: any) => data.map(({
  id, erpId, companyName, accountNumber, bankName,
  creationDate, modificationDate, statusCode
}: any) => ({
  id,
  erpId,
  companyName,
  accountNumber,
  bankName,
  creationDate: dateFormatter(creationDate),
  modificationDate: dateFormatter(modificationDate),
  statusCode
}))
const mandateCollection = dataFormatter(props.data)

</script>

