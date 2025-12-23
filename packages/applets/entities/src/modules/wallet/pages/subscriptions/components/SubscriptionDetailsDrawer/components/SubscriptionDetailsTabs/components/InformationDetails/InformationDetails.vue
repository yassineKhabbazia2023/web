<template>
  <div class="margin-top--6">
    <PAlert
      id="information-details-alert"
      data-testid="subscription-details-information-alert"
    >
      {{ t('alertInstruction') }}
    </PAlert>
    <div
      v-if="isLoading"
      class="flex flex--justify-content-center margin-y--4"
      data-testid="subscription-details-information-loader"
    >
      <PLoader pType="primary" pSize="50" />
    </div>
    <PForm
      v-else
      :pModel="accountModel"
      pLabelPosition="top"
      class="information-details__form margin-top--6"
      aria-describedby="information-details-alert"
      data-testid="subscription-details-information-form"
    >
      <section
        v-for="(section, index) in informationFormStructure"
        :key="`section-${index}`"
        class="information-details__form-section padding-right--5 padding-bottom--1 margin-bottom--6"
      >
        <p
          class="information-details__form-section-title font-bold padding-top--5 margin-bottom--3"
        >
          {{ section.title }}
        </p>
        <PFieldSet
          :pModel="accountModel"
          :pFields="section.fields"
          class="information-details__form-section-fields"
        />
      </section>
    </PForm>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@pulse/toolbox'
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PAlert, PForm, PFieldSet, PLoader } from '@pulse/styleguide/components'
import { fetchAccount, type Account } from '@entities/services/account'
import type { InformationDetailsProps } from './InformationDetailsTypes'
import type { FormSection } from '@entities/types'
import { ProviderName } from '@entities/enums'
import { SubscriptionDetailsContext } from '@entities/modules/wallet/enums'
import { cleanRecordStructure, getFormStructure } from '@entities/utils/referential'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<InformationDetailsProps>()

const isLoading = ref(true)
const informationFormStructure = ref<FormSection[]>()
const accountModel = ref<Account>()
const pageContext = computed(() => props.pageContext ?? SubscriptionDetailsContext.DEFAULT)

const resolveProviderName = (
  providerName: ProviderName | undefined,
  context: SubscriptionDetailsContext,
): ProviderName => {
  if (providerName === ProviderName.PENNYLANE && context === SubscriptionDetailsContext.MOD_APPROVALS) {
    return ProviderName.PENNYLANE_MOD
  }

  return providerName ?? ProviderName.LOOP
}

const providerName = computed(() => {
  const filteredProviders = props.subscriptionOfferDetails?.providers
    .filter(({ providerName }) => providerName !== ProviderName.RYDGE)
  const firstFilteredProviders = filteredProviders?.at(0)

  return resolveProviderName(firstFilteredProviders?.providerName, pageContext.value)
})

onMounted(async () => {
  try {
    const forceDisabled = true
    informationFormStructure.value = await getFormStructure(providerName.value, forceDisabled)
    accountModel.value = await fetchAccount(props.accountId)
    if (accountModel.value !== undefined) {
      cleanRecordStructure(informationFormStructure.value, accountModel.value)
    }
  } catch (error) {
    logger.error('Error fetching information: ', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.information-details {
  &__form-section-fields {
    gap: 0px 20px;
  }
}
</style>
<i18n lang="yaml">
en-US:
  alertInstruction: 'If any information is incorrect, please update it in the CRM'
fr-FR:
  alertInstruction: 'Si des informations sont incorrectes, veuillez les mettre à jour dans le CRM'
</i18n>
