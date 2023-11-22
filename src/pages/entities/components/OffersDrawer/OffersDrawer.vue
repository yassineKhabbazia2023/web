<template>
  <div>
    <PDrawer
      v-model="internalIsOpened"
      :title="t('drawerTitle')"
      :showPreviousStep="false"
      size="50%"
      direction="rtl"
      class="drawer"
    >
      <SubscriptionOffers
        v-if="internalIsOpened"
        data-ut="offers"
        :subscriptionOffers="subscriptionOffers"
      />
    </PDrawer>
  </div>
</template>

<i18n lang="yaml">
    en-US:
      drawerTitle: 'Offers available on this folder'
    fr-FR:
      drawerTitle: 'Offres activables sur ce dossier'
</i18n>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PDrawer
} from '@kpmg/styleguide'
import type { OffersDrawerProps } from './OffersDrawerTypes'
import SubscriptionOffers from '../SubscriptionOffers'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const props = defineProps<OffersDrawerProps>()

const internalIsOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>
