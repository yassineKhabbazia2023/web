<template>
  <div class="margin-top--2">
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
        <PDynamicFields
          :pModel="accountModel"
          :pFields="section.fields"
          class="information-details__form-section-fields"
        />
        <div
          v-if="shouldShowNoSirenToggle(section)"
          class="information-details__no-siren-switch"
        >
          <PSwitch
            :modelValue="hasNoSiren"
            pDisabled
            data-testid="has-no-siren-switch-readonly"
          />
          <span class="margin-left--2">{{ t('hasNoSirenLabel') }}</span>
        </div>
      </section>
    </PForm>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@pulse/toolbox'
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PAlert, PForm, PDynamicFields, PLoader, PSwitch } from '@pulse/styleguide/components'
import { fetchAccount, type Account } from '@entities/services/account'
import type { InformationDetailsProps } from './InformationDetailsTypes'
import type { FormSection } from '@entities/types'
import { ProviderName } from '@entities/enums'
import { SubscriptionDetailsContext } from '@entities/modules/wallet/enums'
import { cleanRecordStructure, getFormStructure } from '@entities/utils/referential'
import { SIREN_FIELD_KEY } from '@entities/constants'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      alertInstruction: 'If any information is incorrect, please update it in the CRM',
      hasNoSirenLabel: 'The company does not have a SIREN yet',
    },
    'fr-FR': {
      alertInstruction: 'Si des informations sont incorrectes, veuillez les mettre à jour dans le CRM',
      hasNoSirenLabel: 'L\'entreprise n\'a pas encore de SIREN',
    },
  },
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

const isPennylaneOffer = computed(() =>
  providerName.value === ProviderName.PENNYLANE || providerName.value === ProviderName.PENNYLANE_MOD,
)

function hasSirenField(section: FormSection): boolean {
  return section.fields.some((field) => field.pFieldKey === SIREN_FIELD_KEY)
}

function shouldShowNoSirenToggle(section: FormSection): boolean {
  return isPennylaneOffer.value && hasSirenField(section) && props.hasNoSiren
}

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
  &__no-siren-switch {
    display: flex;
    align-items: center;
    margin-top: -4px;
  }
}
</style>
