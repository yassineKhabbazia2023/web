<template>
  <div>
    <ConfirmationModal
      v-model="confirmationModalVisible"
      :title="t('confirmationTitle')"
      :content="t('confirmationContent')"
      :confirmButtonLabel="t('confirm')"
      :cancelButtonLabel="t('cancel')"
      :isCancelButtonDisabled="isSaveOfferInProgress"
      :isConfirmButtonDisabled="isSaveOfferInProgress"
      :isConfirmButtonLoading="isSaveOfferInProgress"
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
          class="offers-drawer__details"
        >
          <PIcon
            :color="AppColors.JUNGLE_400"
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
            :pActive="currentStepIndex"
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
            v-if="currentStep === OffersDrawerStep.SERVICES"
            v-model:selectedPlanId="selectedPlanId"
            v-model:selectedPricingId="selectedPricingId"
            data-testid="offer"
            :accountId="props.accountId"
            :subscriptionOffer="currentSubscriptionOffer"
            :selectedProducts="selectedProducts"
            @select-product="onSelectProduct"
            @deselect-product="onDeselectProduct"
          />
          <CustomersDetails
            v-if="
              currentStep === OffersDrawerStep.CUSTOMERS
            "
            :principalContacts="principalContacts"
            :currentSubscriptionOffer
            data-testid="customers-step"
          />
          <ManageCollaborators
            v-if="currentStep === OffersDrawerStep.COLLABORATORS && currentUser"
            v-model:selectedCollaboratorsWithRoles="selectedCollaboratorsWithRoles"
            v-model:knownCollaborators="knownCollaborators"
            :collaboratorRoles="collaboratorRoles"
            data-testid="collaborators-step"
          />
          <CompanyInformation
            v-if="account && currentStep === OffersDrawerStep.INFORMATION"
            ref="companyInformation"
            :modelValue="account"
            :providerName="providerName"
            :offerCode="currentSubscriptionOffer?.offerCode"
            data-testid="information-step"
            @input="onInputAccount"
          />
          <StepNote
            v-if="currentSubscriptionOffer?.approvalRequired && shouldShowStepNote"
            :key="currentStep"
            v-model="notes[currentStepIndex]"
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
import { logger } from '@pulse/toolbox'
import { computed, ref, onMounted, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { sanitizeUrl } from '@pulse/toolbox/utils/url'
import { PDrawer, PSteps, PStep, PIcon, PLoader } from '@pulse/styleguide/components'
import { AppColors, displayNotification } from '@pulse/styleguide'
import SubscriptionOffers from '../SubscriptionOffers'
import OfferSubscription from '../OfferSubscription'
import StepNote from '@entities/components/StepNote'
import CustomersDetails from '@entities/components/CustomersDetails'
import CompanyInformation from '@entities/components/CompanyInformation'
import NextPreviousButtons from '@entities/components/NextPreviousButtons'
import ConfirmationModal from '@entities/components/ConfirmationModal'
import ManageCollaborators from '@entities/components/ManageCollaborators'
import {
  getAllOffers,
  getOffer,
  getOffersBookLink,
} from '@entities/services/offer'
import { getPatchOperations } from '@entities/services/patch-record/patch-record.service'
import { type PatchValue } from '@entities/services/patch-record'
import { OffersDrawerStep, ProviderName } from '@entities/enums'
import { OFFERS_DRAWER_STEPS } from './OffersDrawer.const'
import type { OffersDrawerProps } from './OffersDrawerTypes'
import type { SelectedProduct, SubscriptionOffer, SubscriptionOfferServices, SubscriptionOfferProvider, ContactWithRoles } from '@entities/types'
import { fetchAccount, patchAccount, getAccountSignatories, type Account } from '@entities/services/account'
import type { AccountSignatories } from '@entities/services/account/account.type'
import {
  addSelectedProduct,
  removeSelectedProduct,
  getInitialSelectedProducts,
  getPostSubscriptionRequest,
} from './utils/OffersDrawerUtils'
import type { Note } from '@entities/services/subscription/subscriptionTypes'
import { createSubscriptionRequest, fetchAccountSubscriptions } from '@entities/services/subscription'
import { type Contact } from '@entities/services/contact/contactTypes'
import { ContactType, APICallStatus } from '@pulse/common/enums'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { getIsNextButtonDisabled, updateAccountOnInput } from './OffersDrawer.utils'
import { OfferPlanManager } from '../OfferSubscription/components/OfferPlanSubscription/offer-plan.manager'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const currentStepIndex = ref(0)
const saveOfferApiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)
const currentStep = computed(() => OFFERS_DRAWER_STEPS[currentStepIndex.value])
const isSaveOfferInProgress = computed(() => saveOfferApiCallStatus.value === APICallStatus.LOADING)

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
    currentStep.value === OffersDrawerStep.INFORMATION ||
    !currentSubscriptionOffer.value?.approvalRequired
  )
})

const isNextButtonDisabled = computed(() => {
  // Check Pennylane-specific validation on INFORMATION step
  if (
    currentStep.value === OffersDrawerStep.INFORMATION &&
    companyInformationRef.value?.areRequiredFieldsValid === false
  ) {
    return true
  }

  // Check plan selection on SERVICES step for offers with plans
  const hasPlans = (currentSubscriptionOffer.value?.plans?.length ?? 0) > 0
  if (currentStep.value === OffersDrawerStep.SERVICES && hasPlans && selectedPlanId.value === undefined) {
    return true
  }

  // Check pricing selection on SERVICES step for selected plan with pricings
  if (currentStep.value === OffersDrawerStep.SERVICES && selectedPlanId.value !== undefined) {
    const selectedPlan = currentSubscriptionOffer.value?.plans?.find(p => p.planId === selectedPlanId.value)
    const hasPricings = (selectedPlan?.pricings?.length ?? 0) > 0
    if (hasPricings && selectedPricingId.value === undefined) {
      return true
    }
  }

  return getIsNextButtonDisabled({
    currentSubscriptionOffer: currentSubscriptionOffer.value,
    currentStep: currentStep.value,
    selectedCollaboratorsWithRoles: selectedCollaboratorsWithRoles.value,
    principalContacts: principalContacts.value,
  })
})

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'offer-saved': [],
}>()

const props = defineProps<OffersDrawerProps>()

const currentSubscriptionOffer = ref<SubscriptionOfferServices | undefined>()
const activeOfferCodes = ref<string[]>([])
const patchValues: PatchValue[] = []
const selectedProducts = ref<SelectedProduct[]>([])
const selectedPlanId = ref<number | undefined>()
const selectedPricingId = ref<number | undefined>()
const subscriptionOffers = ref<SubscriptionOffer[]>([])
const knownCollaborators = ref<Contact[]>([])
const selectedCollaboratorsWithRoles = ref<ContactWithRoles[]>([])
const principalContacts = ref<AccountSignatories[]>([])
const account = ref<Account | undefined>()
const notes = ref<Note[]>([])
const isLoadingOffers = ref<boolean>()
const isLoadingAccount = ref<boolean>()
const confirmationModalVisible = ref<boolean>(false)
const companyInformationRef = useTemplateRef('companyInformation')

const isLoading = computed(() => isLoadingOffers.value === true || isLoadingAccount.value === true)

const internalIsOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const collaboratorRoles = computed(() => currentSubscriptionOffer.value?.functions ?? [])

const setSelectedOffer = async (selectedOfferId?: number | undefined) => {
  if (selectedOfferId === undefined) {
    currentSubscriptionOffer.value = undefined
  } else {
    currentSubscriptionOffer.value = await getOffer(selectedOfferId)
    const {
      id,
      firstName,
      lastName,
      email,
      oldId,
      persona,
    } = props.currentUser

    const contact: Contact = {
      id,
      firstName,
      lastName,
      email,
      landPhone: '',
      mobilePhone: '',
      type: ContactType.COLLABORATOR,
      office: '',
      persona,
      createdAt: '',
      oldId,
    }
    knownCollaborators.value = [contact]
    selectedCollaboratorsWithRoles.value = [{
      contactId: contact.id,
      roleIds: [],
    }]
    AmplitudeService.track('Subscription Initiated', {
      subscription_initiate_offer_name: currentSubscriptionOffer.value?.offerCode,
    })
    if (currentSubscriptionOffer.value?.approvalRequired) {
      initNoteSteps()
    } else {
      notes.value = []
    }
  }
  selectedPlanId.value = undefined
  selectedPricingId.value = undefined
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
  account.value = updateAccountOnInput(fieldKey, value, patchValues, account.value)
}

function onClickPrevious() {
  if (currentStep.value === OffersDrawerStep.SERVICES) {
    setSelectedOffer()
  } else {
    --currentStepIndex.value
  }
}

function onSelectProduct(offerId: number, productId: number) {
  addSelectedProduct(selectedProducts.value, offerId, productId)
}

function onDeselectProduct(offerId: number, productId: number) {
  removeSelectedProduct(selectedProducts.value, offerId, productId)
}

const getSelectedHubName = () => {
  const selectedHubName = companyInformationRef.value?.getSelectedHubName()
  return selectedHubName ?? account.value?.hub?.hubName
}

async function saveOffer() {
  const postSubscriptionRequest = getPostSubscriptionRequest({
    accountId: props.accountId,
    hubName: getSelectedHubName(),
    userEmail: props.currentUser?.email,
    collaboratorsWithRoles: selectedCollaboratorsWithRoles.value,
    clients: principalContacts.value,
    currentSubscriptionOffer: currentSubscriptionOffer.value,
    selectedProducts: selectedProducts.value,
    notes: notes.value,
    selectedPlanId: selectedPlanId.value,
    selectedPricingId: selectedPricingId.value,
    hasNoSiren: account.value?.legal?.hasNoSiren,
  })
  if (postSubscriptionRequest) {
    await createSubscriptionRequest(postSubscriptionRequest)
  }
}

async function validateOffer() {
  saveOfferApiCallStatus.value = APICallStatus.LOADING
  const patchOperations = getPatchOperations(patchValues)
  if (patchOperations.length > 0) {
    try {
      await patchAccount(props.accountId, patchOperations)
    } catch (error) {
      logger.error(error)
    }
  }

  const planName = OfferPlanManager.getPlanName(
    selectedPlanId.value,
    currentSubscriptionOffer.value?.plans,
  )

  try {
    await saveOffer()
    saveOfferApiCallStatus.value = APICallStatus.SUCCESS
    if (!currentSubscriptionOffer.value?.approvalRequired) {
      displayNotification('success', t('offerActivated'))
      AmplitudeService.track('Subscription Started', {
        subscription_start_offer_name: currentSubscriptionOffer.value?.offerCode,
        subscription_start_result: 'succeeded',
      })
      AmplitudeService.track('Subscription Completed', {
        subscription_complete_offer_name: currentSubscriptionOffer.value?.offerCode,
        subscription_complete_localisation: 'offer activation screen',
        subscription_complete_result: 'succeeded',
      })
      AmplitudeService.track('Onboarding Started', {
        onboarding_start_localisation: 'Offer activation',
        onboarding_start_result: 'succeeded',
      })
    } else {
      displayNotification('success', t('subscriptionCreated'))
      AmplitudeService.track('Subscription Started', {
        subscription_start_offer_name: currentSubscriptionOffer.value?.offerCode,
        subscription_start_result: 'succeeded',
        subscription_start_plan: planName,
      })
    }
  } catch (error) {
    saveOfferApiCallStatus.value = APICallStatus.ERROR
    if (!currentSubscriptionOffer.value?.approvalRequired) {
      displayNotification('error', t('offerNotActivated'))
      AmplitudeService.track('Subscription Started', {
        subscription_start_offer_name: currentSubscriptionOffer.value?.offerCode,
        subscription_start_result: 'failed',
      })
      AmplitudeService.track('Subscription Completed', {
        subscription_complete_offer_name: currentSubscriptionOffer.value?.offerCode,
        subscription_complete_localisation: 'offer activation screen',
        subscription_complete_result: 'failed',
      })
      AmplitudeService.track('Onboarding Started', {
        onboarding_start_localisation: 'Offer activation',
        onboarding_start_result: 'failed',
      })
    } else {
      displayNotification('error', t('subscriptionNotCreated'))
      AmplitudeService.track('Subscription Started', {
        subscription_start_offer_name: currentSubscriptionOffer.value?.offerCode,
        subscription_start_result: 'failed',
        subscription_start_plan: planName,
      })
    }
    logger.error(error)
  }
}

const handleConfirm = async () => {
  await validateOffer()
  confirmationModalVisible.value = false
  emit('offer-saved')
}

async function onClickNext() {
  if (currentStep.value === OffersDrawerStep.INFORMATION) {
    const formIsValid = await companyInformationRef.value?.isValid?.()

    if (!formIsValid) {
      return
    }
  }
  if (isSubmitButton.value) {
    confirmationModalVisible.value = true
    return
  }
  ++currentStepIndex.value
}

function onSelectOffer(offerId: number) {
  setSelectedOffer(offerId)
}

const onCloseOffersDrawer = () => {
  internalIsOpened.value = false
}

const providerName = computed(() => {
  const filteredProviders = currentSubscriptionOffer.value?.providers
    .filter(({ providerName }: SubscriptionOfferProvider) => providerName !== ProviderName.RYDGE)
  const firstFilteredProviders = filteredProviders?.at(0)

  return firstFilteredProviders?.providerName
})

const isPennylaneOffer = computed(() => {
  return providerName.value === ProviderName.PENNYLANE || providerName.value === ProviderName.PENNYLANE_MOD
})

const shouldShowStepNote = computed(() => {
  // For Pennylane offers on SERVICES step, show note only when Next button is active (plan selected)
  if (currentStep.value === OffersDrawerStep.SERVICES && isPennylaneOffer.value === true) {
    return isNextButtonDisabled.value === false
  }
  return true
})

const offerSanitizedUrl = computed(() => {
  return sanitizedOffersDrawerLink.value.link
    ? sanitizeUrl(sanitizedOffersDrawerLink.value.link)
    : ''
})

async function initDrawerForCurrentAccount() {
  isLoadingAccount.value = true
  await setSelectedOffer()
  currentStepIndex.value = 0
  principalContacts.value = await getAccountSignatories(props.accountId)
  const activeOffers = await fetchAccountSubscriptions(props.accountId)
  activeOfferCodes.value = activeOffers.map((activeOffer) => activeOffer.offer.offerCode)
  account.value = await fetchAccount(props.accountId)
  isLoadingAccount.value = false
}

onMounted(async () => {
  try {
    isLoadingOffers.value = true
    subscriptionOffers.value = await getAllOffers()
  } catch (error) {
    logger.error('Unable to retrieve data for subscribing to an offer :', error)
  } finally {
    isLoadingOffers.value = false
  }
})

defineExpose({
  initDrawerForCurrentAccount,
})
</script>

<style lang="scss" scoped>
.offers-drawer {
  &__company-name {
    color: var(--p-gray-400);
  }
  &__details {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    margin-left: 16px;

    @media screen and (max-width: 1200px) {
      width: 100%;
      margin-left: 0;
      margin-top: 8px;
    }

    &-link {
      color: var(--p-jungle-400);
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
