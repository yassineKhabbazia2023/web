<template>
  <PTable
    class="width--100"
    :pData="addressingIdentifications"
    pStripe
    pTestId="addressing-identification-table"
  >
    <PTableColumn
      pSortable
      pProp="callName"
      pMinWidth="150"
      :pLabel="t('entities.addressingIdentification.table.callName')"
    />
    <PTableColumn
      pSortable
      pProp="addressingIdentifier"
      pMinWidth="180"
      :pLabel="t('entities.addressingIdentification.table.addressingIdentifier')"
    />
  </PTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PTable, PTableColumn } from '@pulse/styleguide/components'
import type { AddressingIdentification } from '@entities/services/account'

const { t } = useI18n()

withDefaults(defineProps<{
  addressingIdentifications?: AddressingIdentification[]
}>(), {
  addressingIdentifications: () => [],
})
</script>
