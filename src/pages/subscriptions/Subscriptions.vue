<template>
  <div>
    <h1 class="margin-bottom--4">
      {{ t('title') }}
    </h1>

    <SubscriptionsTable />
  </div>
</template>

<i18n lang="yaml">
  en-US:
    title: 'Offer activation request to be validated'
  fr-FR:
    title: "Demande d'activation d'offre à valider"
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SubscriptionsTable from './components/subscriptionsTable'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
</script>
