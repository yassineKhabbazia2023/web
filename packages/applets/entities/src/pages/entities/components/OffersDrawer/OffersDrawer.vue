<template>
  <div>
    <ConfirmationModal
      v-model="confirmationModalVisible"
      :title="t('confirmationTitle')"
      :content="t('confirmationContent')"
      :confirmButtonLabel="t('confirm')"
      :cancelButtonLabel="t('cancel')"
      data-testid="create-offer-confirmation-modal"
      @confirm="handleConfirm"
    />
    <PDrawer
      v-model="internalIsOpened"
      :pTitle="offersDrawerTitle"
      :pShowPreviousStep="false"
      pSize="50%"
      pDirection="rtl"
      class="offers-drawer"
      data-testid="drawer"
      @close-drawer-button="onCloseOffersDrawer"
    >
      <template #header-prefix>
        <p class="offers-drawer__company-name font-base">
          {{ selectedCompanyName }}
        </p>
      </template>
      <template #header-suffix>
        <div
          v-if="offerSanitizedUrl"
          class="offers-drawer__details margin-left--4"
        >
          <PIcon
            :color="AppColors.PRIMARY"
            size="16"
            pName="link45deg"
          />
          <a
            class="offers-drawer__details-link font-base link margin-left--1"
            :href="offerSanitizedUrl"
            target="_blank"
          >
            {{ sanitizedOffersDrawerLink.titleLink }}
          </a>
        </div>
      </template>
      <div
        v-if="isLoading"
        class="flex flex--justify-content-center margin-y--4"
      >
        <PLoader pType="primary" pSize="50" />
      </div>
      <template v-if="internalIsOpened && !isLoading">
        <div v-if="!!currentSubscriptionOffer">
          <PSteps
            v-if="currentSubscriptionOffer?.approvalRequired"
            :pActive="activeStep"
            :pDirection="offerStepperConfig.direction"
            :pProcessStatus="offerStepperConfig.processStatus"
            :pFinishStatus="offerStepperConfig.finishStatus"
            class="padding-y--3 margin-bottom--9"
            data-testid="offer-stepper"
          >
            <PStep :pTitle="offerStepTitles.services" />
            <PStep :pTitle="offerStepTitles.customers" />
            <PStep :pTitle="offerStepTitles.collaborators" />
            <PStep :pTitle="offerStepTitles.information" />
          </PSteps>
          <CustomersDetails
            v-if="!currentSubscriptionOffer?.approvalRequired"
            :principalContacts="principalContacts"
            data-testid="customers-step"
          />
          <OfferSubscription
            v-if="activeStep === offerStepperStep.SERVICES"
            data-testid="offer"
            :accountId="props.accountId"
            :subscriptionOffer="currentSubscriptionOffer"
            :selectedProducts="selectedProducts"
            @select-product="onSelectProduct"
            @deselect-product="onDeselectProduct"
          />
          <CustomersDetails
            v-if="
              activeStep === offerStepperStep.CUSTOMERS
            "
            :principalContacts="principalContacts"
            data-testid="customers-step"
          />
          <ManageCollaborators
            v-if="activeStep === offerStepperStep.COLLABORATORS"
            v-model:collaborators="collaborators"
            :defaultCollaborator="currentUser"
            data-testid="collaborators-step"
          />
          <CompanyInformation
            v-if="account && activeStep === offerStepperStep.INFORMATION"
            :modelValue="account"
            :providerName="providerName"
            data-testid="information-step"
            @input="onInputAccount"
          />
          <StepNote
            v-if="currentSubscriptionOffer?.approvalRequired"
            :key="activeStep"
            v-model="notes[activeStep]"
            class="margin-top--6"
          />
        </div>
        <SubscriptionOffers
          v-else
          data-testid="offers"
          :subscriptionOffers="subscriptionOffers"
          :activeOffers="activeOfferCodes"
          @select-offer="onSelectOffer"
        />
      </template>
      <template #footer>
        <NextPreviousButtons
          v-if="!!currentSubscriptionOffer"
          data-testid="next-previous-buttons"
          :previousLabel="t('previousLabel')"
          :nextLabel="nextLabel"
          :isNextButtonDisabled="isNextButtonDisabled"
          @click-previous="onClickPrevious"
          @click-next="onClickNext"
        />
      </template>
    </PDrawer>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@pulse/core'
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { sanitizeUrl } from '@braintree/sanitize-url'
import { get } from 'lodash-es'
import { PDrawer, PSteps, PStep, PIcon, PLoader } from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import SubscriptionOffers from '../SubscriptionOffers'
import OfferSubscription from '../OfferSubscription'
import StepNote from '@entities/common/components/StepNote'
import CustomersDetails from '@entities/common/components/CustomersDetails'
import CompanyInformation from '../CompanyInformation'
import NextPreviousButtons from '@entities/common/components/NextPreviousButtons'
import { displayNotification } from '@entities/common/utils/helpers'
import ConfirmationModal from '@entities/common/components/ConfirmationModal'
import ManageCollaborators from '../ManageCollaborators'
import {
  getAllOffers,
  getOffer,
  getOffersBookLink,
  getPrincipalContacts,
} from '@entities/services/offer'
import { addPathValue, getPatchOperations } from '@entities/services/PatchRecordService/PatchRecordService'
import { type PatchValue } from '@entities/services/PatchRecordService'
import { offerStepperStep } from './OffersDrawerTypes'
import type { OffersDrawerProps } from './OffersDrawerTypes'
import type { SelectedProduct } from '@entities/common/types'
import { fetchAccount, patchAccount, type Account } from '@entities/services/account'
import {
  addSelectedProduct,
  removeSelectedProduct,
  getInitialSelectedProducts,
  getPostSubscriptionRequest,
} from './utils/OffersDrawerUtils'
import type { ClientContact } from '../PrincipalContact/PrincipalContactTypes'
import type {
  SubscriptionOffer,
  SubscriptionOfferServices,
} from '../SubscriptionOffers/SubscriptionOffersTypes'
import { ProviderName } from '@entities/common/types/ProviderNameEnums'
import { type Note, createSubscriptionRequest, fetchAccountSubscriptions } from '@entities/services/subscription'
import type { Contact } from '@entities/services/contact/contactTypes'
import { amplitudeService } from '@pulse/common'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const activeStep = ref<number>(0)

const offerStepperConfig: any = {
  direction: 'horizontal',
  processStatus: 'process',
  finishStatus: 'success',
}

const offerStepTitles = {
  services: t('services'),
  customers: t('customers'),
  collaborators: t('collaborators'),
  information: t('information'),
}

const isSubmitButton = computed((): boolean => {
  return (
    activeStep.value === offerStepperStep.INFORMATION ||
    !currentSubscriptionOffer.value?.approvalRequired
  )
})

const isNoCollaboratorSelected = computed(() => {
  return activeStep.value === offerStepperStep.COLLABORATORS && collaborators.value.length === 0
})

const hasNoSignatory = computed(() => {
  return (activeStep.value === offerStepperStep.CUSTOMERS || !currentSubscriptionOffer?.value?.approvalRequired) &&
  principalContacts.value.length === 0
})

const isNextButtonDisabled = computed(() => {
  return hasNoSignatory.value || isNoCollaboratorSelected.value
})

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const props = defineProps<OffersDrawerProps>()

const currentSubscriptionOffer = ref<SubscriptionOfferServices | undefined>()
const activeOfferCodes = ref<string[]>([])
const patchValues: PatchValue[] = []
const selectedProducts = ref<SelectedProduct[]>([])
const subscriptionOffers = ref<SubscriptionOffer[]>([])
const collaborators = ref<Contact[]>([])
const principalContacts = ref<ClientContact[]>([])
const account = ref<Account | undefined>()
const notes = ref<Note[]>([])
const isLoading = ref<boolean>(true)
const confirmationModalVisible = ref<boolean>(false)

const internalIsOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const setSelectedOffer = async (selectedOfferId?: number | undefined) => {
  if (selectedOfferId === undefined) {
    currentSubscriptionOffer.value = undefined
  } else {
    currentSubscriptionOffer.value = await getOffer(selectedOfferId)
    collaborators.value = []
    amplitudeService.track('Subscription Initiated', {
      subscription_initiate_offer_name: currentSubscriptionOffer.value?.offerCode,
    })
    if (currentSubscriptionOffer.value?.approvalRequired) {
      initNoteSteps()
    } else {
      notes.value = []
    }
  }
  selectedProducts.value = getInitialSelectedProducts(
    currentSubscriptionOffer.value,
  )
}

const initNoteSteps = () => {
  notes.value = [
    {
      stepName: 'services',
      stepNote: '',
    },
    {
      stepName: 'customers',
      stepNote: '',
    },
    {
      stepName: 'collaborators',
      stepNote: '',
    },
    {
      stepName: 'information',
      stepNote: '',
    },
  ]
}

const nextLabel = computed((): string => {
  return isSubmitButton.value ? t('submitLabel') : t('nextLabel')
})

const offersDrawerTitle = computed((): string => {
  if (currentSubscriptionOffer.value) {
    return currentSubscriptionOffer.value.offerName
  }
  return t('drawerTitle')
})

const sanitizedOffersDrawerLink = computed(
  (): { link: string | undefined, titleLink: string } => {
    if (currentSubscriptionOffer.value) {
      return {
        link: currentSubscriptionOffer.value.intranetLink,
        titleLink: t('offerIntranet'),
      }
    }
    const offersBookLink = getOffersBookLink()
    return {
      link: offersBookLink,
      titleLink: t('offersBook'),
    }
  },
)

function onInputAccount(fieldKey: string, value: any) {
  const previousValue = get(account.value, fieldKey)
  addPathValue(patchValues, fieldKey, previousValue, value)
}

function onClickPrevious() {
  if (activeStep.value === offerStepperStep.SERVICES) {
    setSelectedOffer()
  } else {
    --activeStep.value
  }
}

function onSelectProduct(offerId: number, productId: number) {
  addSelectedProduct(selectedProducts.value, offerId, productId)
}

function onDeselectProduct(offerId: number, productId: number) {
  removeSelectedProduct(selectedProducts.value, offerId, productId)
}

async function saveOffer() {
  const postSubscriptionRequest = getPostSubscriptionRequest(
    props.accountId,
    props.currentUser?.email,
    collaborators.value,
    principalContacts.value,
    currentSubscriptionOffer.value,
    selectedProducts.value,
    notes.value,
  )
  if (postSubscriptionRequest) {
    await createSubscriptionRequest(postSubscriptionRequest)
  }
}

async function validateOffer() {
  const patchOperations = getPatchOperations(patchValues)
  if (patchOperations.length > 0) {
    try {
      await patchAccount(props.accountId, patchOperations)
    } catch (error) {
      logger.error(error)
    }
  }
  try {
    await saveOffer()
    if (!currentSubscriptionOffer.value?.approvalRequired) {
      displayNotification('success', t('offerActivated'))
      amplitudeService.track('Subscription Started', {
        subscription_start_offer_name: currentSubscriptionOffer.value?.offerCode,
        subscription_start_result: 'succeeded',
      })
      amplitudeService.track('Subscription Completed', {
        subscription_complete_offer_name: currentSubscriptionOffer.value?.offerCode,
        subscription_complete_localisation: 'offer activation screen',
        subscription_complete_result: 'succeeded',
      })
      amplitudeService.track('Onboarding Started', {
        onboarding_start_localisation: 'Offer activation',
        onboarding_start_result: 'succeeded',
      })
    } else {
      displayNotification('success', t('subscriptionCreated'))
      amplitudeService.track('Subscription Started', {
        subscription_start_offer_name: currentSubscriptionOffer.value?.offerCode,
        subscription_start_result: 'succeeded',
      })
    }
  } catch (error) {
    if (!currentSubscriptionOffer.value?.approvalRequired) {
      displayNotification('error', t('offerNotActivated'))
      amplitudeService.track('Subscription Started', {
        subscription_start_offer_name: currentSubscriptionOffer.value?.offerCode,
        subscription_start_result: 'failed',
      })
      amplitudeService.track('Subscription Completed', {
        subscription_complete_offer_name: currentSubscriptionOffer.value?.offerCode,
        subscription_complete_localisation: 'offer activation screen',
        subscription_complete_result: 'failed',
      })
      amplitudeService.track('Onboarding Started', {
        onboarding_start_localisation: 'Offer activation',
        onboarding_start_result: 'failed',
      })
    } else {
      displayNotification('error', t('subscriptionNotCreated'))
      amplitudeService.track('Subscription Started', {
        subscription_start_offer_name: currentSubscriptionOffer.value?.offerCode,
        subscription_start_result: 'failed',
      })
    }
    logger.error(error)
  }
}

const handleConfirm = async () => {
  await validateOffer()
  confirmationModalVisible.value = false

  // To ensure a good user experience, as closing two things simultaneously is not ideal
  setTimeout(() => {
    onCloseOffersDrawer()
  }, 600)
}

function onClickNext() {
  if (isSubmitButton.value) {
    confirmationModalVisible.value = true
    return
  }
  ++activeStep.value
}

function onSelectOffer(offerId: number) {
  setSelectedOffer(offerId)
}

const onCloseOffersDrawer = () => {
  internalIsOpened.value = false
}

const providerName = computed(() => {
  const filteredProviders = currentSubscriptionOffer.value?.providers
    .filter(({ providerName }) => providerName !== ProviderName.PULSE)
  const firstFilteredProviders = filteredProviders?.at(0)

  return firstFilteredProviders?.providerName
})

const offerSanitizedUrl = computed(() => {
  return sanitizedOffersDrawerLink.value.link
    ? sanitizeUrl(sanitizedOffersDrawerLink.value.link)
    : ''
})

onMounted(async () => {
  try {
    subscriptionOffers.value = await getAllOffers()
    principalContacts.value = await getPrincipalContacts(props.accountId)
    const activeOffers = await fetchAccountSubscriptions(props.accountId)
    activeOfferCodes.value = activeOffers.map((activeOffer) => activeOffer.offer.offerCode)
    account.value = await fetchAccount(props.accountId)
  } catch (error) {
    logger.error('Unable to retrieve data for subscribing to an offer :', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.offers-drawer {
  &__company-name {
    color: var(--el-text-color-secondary);
  }
  &__details {
    display: flex;
    align-items: center;
    flex: 0 0 auto;

    &-link {
      color: var(--el-color-persian-500);
      font-weight: 600;
      text-decoration: none;

      &:hover,
      &:focus {
        text-decoration: underline;
      }
    }
  }
}
</style>
<i18n lang="yaml">
en-US:
  drawerTitle: 'Offers available on this folder'
  previousLabel: 'Previous'
  nextLabel: 'Next'
  submitLabel: 'Submit'
  services: 'Services'
  customers: 'Customers'
  collaborators: 'Collaborators'
  information: 'Information'
  offerIntranet: 'Offer Intranet'
  offersBook: 'Offers Book'
  confirm: 'Confirm'
  cancel: 'Cancel'
  confirmationTitle: 'Attention'
  subscriptionCreated: 'The subscription was created'
  subscriptionNotCreated: 'The subscription could not be created'
  offerActivated: 'The offer has been activated'
  offerNotActivated: 'The offer could not be activated'
  confirmationContent: >
    After confirmation, the offer activation request will be submitted,
    and there will be no option to revert. Please review your information
    carefully before proceeding.
fr-FR:
  drawerTitle: 'Offres activables sur ce dossier'
  previousLabel: 'Précédent'
  nextLabel: 'Suivant'
  submitLabel: 'Valider'
  confirm: 'Confirmer'
  cancel: 'Annuler'
  services: 'Services'
  customers: 'Clients'
  collaborators: 'Collaborateurs'
  information: 'Informations'
  offerIntranet: "Intranet de l'offre"
  offersBook: 'Book des offres'
  confirmationTitle: 'Attention'
  subscriptionCreated: 'La souscription a été créée'
  subscriptionNotCreated: "La souscription n'a pas pu être créée"
  offerActivated: "L'offre a été activée"
  offerNotActivated: "L'offre n'a pas pu être activée"
  confirmationContent: >
    Une fois confirmée, la demande d'activation d'offre sera créée
    et vous ne pourrez plus revenir en arrière.
    Veuillez donc vérifier vos informations avant de valider.
</i18n>
