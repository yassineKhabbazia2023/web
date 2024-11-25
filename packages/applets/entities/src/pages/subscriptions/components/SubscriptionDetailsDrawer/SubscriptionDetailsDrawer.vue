<template>
  <PDrawer
    v-model="internalIsOpened"
    :pShowPreviousStep="false"
    pSize="50%"
    :pTitle="subscriptionDrawerTitle"
    pDirection="rtl"
    class="subscription-drawer"
    data-testid="subscription-drawer"
    @close-drawer-button="handleCloseDrawer"
  >
    <div
      v-if="isLoading"
      class="flex flex--justify-content-center margin-y--4"
      data-testid="folder-information-loader"
    >
      <PLoader pType="primary" pSize="50" />
    </div>
    <SubscriptionDetailsTabs
      v-else
      :subscriptionDetails="subscriptionDetails"
      data-testid="subscription-recap-drawer-tabs"
    />
  </PDrawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PLoader } from '@pulse/styleguide/components'
import type { SubscriptionDetailsDrawerProps } from './SubscriptionDetailsDrawerTypes'
import SubscriptionDetailsTabs from './components/SubscriptionDetailsTabs'
import {
  fetchSubscriptionDetails,
  type SubscriptionDetails,
} from '@entities/services/subscription'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<SubscriptionDetailsDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const isLoading = ref<boolean>(true)
const subscriptionDetails = ref<SubscriptionDetails | undefined>(undefined)

const internalIsOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const subscriptionDrawerTitle = computed(() => {
  if (!subscriptionDetails.value) {
    return ''
  }
  return `${subscriptionDetails.value.account.accountLegalName} - ${t(
    'number',
  )} ${subscriptionDetails.value.account.accountNumber}`
})

const handleCloseDrawer = () => {
  internalIsOpened.value = false
}

onMounted(async () => {
  try {
    subscriptionDetails.value = await fetchSubscriptionDetails(
      props.selectedSubscriptionId,
    )
  } catch (error) {
    console.error('Unable to retrieve subscription summary :', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.subscription-drawer {
  &__account-name {
    color: var(--el-text-color-secondary);
  }
}
</style>

<i18n lang="yaml">
en-US:
  number: 'No.'
fr-FR:
  number: 'Nº'
</i18n>
