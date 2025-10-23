<template>
  <div class="flex padding-y--2 flex--align-items-center">
    <PIcon
      pName="building"
      class="margin-x--4"
      pSize="20"
    />
    <ul class="list-style-none">
      <li class="margin-bottom--1 flex flex--align-items-center">
        <span class="font-large font-bold margin-right--3">
          {{ accountOperations.accountName }}
        </span>
        <PTag
          pIconLeftName="stars"
          :pContent="tagContent"
          pColor="success"
        />
      </li>
      <li>
        {{ t('customerCode') }}:
        {{ accountOperations.accountNumber }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PIcon, PTag } from '@pulse/styleguide/components'
import { AccountHeaderProps } from './AccountHeader.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<AccountHeaderProps>()

const tagContent = computed(() => {
  const count = props.accountOperations.operations.length
  return t('tagContent', { count }, count)
})
</script>

<i18n lang="yaml">
en-US:
  customerCode: Customer code
  tagContent: '{count} demand | {count} demands'
fr-FR:
  customerCode: Code client
  tagContent: '{count} demande | {count} demandes'
</i18n>
