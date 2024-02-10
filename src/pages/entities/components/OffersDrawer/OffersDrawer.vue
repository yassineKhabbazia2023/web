<template>
  <div>
    <ModalConfirmation
      v-model="modalConfirmationVisible"
      :title="t('confirmationTitle')"
      :content="t('confirmationContent')"
      @confirm="handleConfirm"
      data-testid="modal-confirmation"
    />
    <PDrawer
      v-model="internalIsOpened"
      :pTitle="offersDrawerTitle"
      :pShowPreviousStep="false"
      pSize="50%"
      pDirection="rtl"
      class="offers-drawer"
      @close-drawer-button="onCloseOffersDrawer"
      data-testid="drawer"
    >
      <template #header-prefix>
        <p class="offers-drawer__company-name font-base">
          {{ selectedCompanyName }}
        </p>
      </template>
      <template #header-suffix>
        <div
          v-if="offersDrawerDetails.link"
          class="offers-drawer__details margin-left--4"
        >
          <PIcon color="#5546FF" size="16">
            <PILink45deg />
          </PIcon>
          <a
            class="offers-drawer__details-link font-base link margin-left--1"
            :href="offersDrawerDetails.link"
            target="_blank"
          >
            {{ offersDrawerDetails.titleLink }}
          </a>
        </div>
      </template>
      <template v-if="internalIsOpened">
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
          <OfferSubscription
            v-if="activeStep === offerStepperStep.SERVICES"
            data-testid="offer"
            :subscriptionOffer="currentSubscriptionOffer"
            :selectedProducts="selectedProducts"
            @select-product="onSelectProduct"
            @deselect-product="onDeselectProduct"
          />
          <PrincipalContact
            :principalContact="principalContact"
            v-if="activeStep === offerStepperStep.CUSTOMERS && principalContact"
            data-testid="customers-step"
          />
          <p
            v-if="activeStep === offerStepperStep.COLLABORATORS"
            data-testid="collaborators-step"
          />
          <pre v-if="activeStep === offerStepperStep.INFORMATION" data-testid="information-step">
            {{ account }}
          </pre>
        </div>
        <SubscriptionOffers
          v-else
          data-testid="offers"
          :subscriptionOffers="subscriptionOffers"
          @select-offer="onSelectOffer"
        />
      </template>
      <template #footer>
        <NextPreviousButtons
          v-if="!!currentSubscriptionOffer"
          :hasCheckIcon="isSubmitButton"
          data-testid="next-previous-buttons"
          :previousLabel="t('previousLabel')"
          :nextLabel="nextLabel"
          @click-previous="onClickPrevious"
          @click-next="onClickNext"
        />
      </template>
    </PDrawer>
  </div>
</template>

<!-- eslint-disable max-len -->
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
  confirmationTitle: 'Attention'
  confirmationContent: 'After confirmation, the offer activation request will be submitted, and there will be no option to revert. Please review your information carefully before proceeding.'
fr-FR:
  drawerTitle: 'Offres activables sur ce dossier'
  previousLabel: 'Précédent'
  nextLabel: 'Suivant'
  submitLabel: 'Valider'
  services: 'Services'
  customers: 'Clients'
  collaborators: 'Collaborateurs'
  information: 'Informations'
  offerIntranet: "Intranet de l'offre"
  offersBook: 'Book des offres'
  confirmationTitle: 'Attention'
  confirmationContent: "Une fois confirmée, la demande d'activation d'offre sera créée et vous ne pourrez plus revenir en arrière. Veuillez donc vérifier vos informations avant de valider."
</i18n>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PSteps, PStep, PIcon, PILink45deg } from '@kpmg/styleguide'
import SubscriptionOffers from '../SubscriptionOffers'
import OfferSubscription from '../OfferSubscription'
import PrincipalContact from '../PrincipalContact'
import NextPreviousButtons from '../NextPreviousButtons'
import ModalConfirmation from '../ModalConfirmation'
import { getAllOffers, getOffer, getOffersBookLink, getPrincipalContact } from '@/services/offer'
import { offerStepperStep, type OffersDrawerProps, type SelectedProduct } from './OffersDrawerTypes'
import { fetchAccount, type Account } from '@/services/account'
import {
  addSelectedProduct, removeSelectedProduct, getInitialSelectedProducts, getPostSubscriptionRequest
} from './OffersDrawerUtils'
import type { User } from '../PrincipalContact/PrincipalContactTypes'
import type {
  SubscriptionOffer,
  SubscriptionOfferServices
} from '../SubscriptionOffers/SubscriptionOffersTypes'
import { createSubscriptionRequestNew } from '@/pages/subscriptions/SubscriptionsServices'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const activeStep = ref<number>(0)

const offerStepperConfig: any = {
  direction: 'horizontal',
  processStatus: 'process',
  finishStatus: 'success'
}

const offerStepTitles = {
  services: t('services'),
  customers: t('customers'),
  collaborators: t('collaborators'),
  information: t('information')
}

const isSubmitButton = computed((): boolean => {
  return (
    activeStep.value === offerStepperStep.INFORMATION ||
    !currentSubscriptionOffer.value?.approvalRequired
  )
})

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const props = defineProps<OffersDrawerProps>()

const currentSubscriptionOffer = ref<SubscriptionOfferServices | undefined>()
const selectedProducts = ref<SelectedProduct[]>([])
const subscriptionOffers = ref<SubscriptionOffer[]>([])
const principalContact = ref<User | undefined>()
const account = ref<Account | undefined>()
const modalConfirmationVisible = ref<boolean>(false)

const internalIsOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const setSelectedOffer = async (selectedOfferId?: number | undefined) => {
  if (selectedOfferId === undefined) {
    currentSubscriptionOffer.value = undefined
  } else {
    currentSubscriptionOffer.value = await getOffer(selectedOfferId)
  }
  selectedProducts.value = getInitialSelectedProducts(currentSubscriptionOffer.value)
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

const offersDrawerDetails = computed(
  (): { link: string | undefined; titleLink: string } => {
    if (currentSubscriptionOffer.value) {
      return {
        link: currentSubscriptionOffer.value.intranetLink,
        titleLink: t('offerIntranet')
      }
    }
    const offersBookLink = getOffersBookLink()
    return {
      link: offersBookLink,
      titleLink: t('offersBook')
    }
  }
)

function onClickPrevious() {
  if (activeStep.value === offerStepperStep.SERVICES) {
    setSelectedOffer()
  } else {
    --activeStep.value
  }
}

function onSelectProduct(offerId: number, productId: string) {
  addSelectedProduct(selectedProducts.value, offerId, productId)
}

function onDeselectProduct(offerId: number, productId: string) {
  removeSelectedProduct(selectedProducts.value, offerId, productId)
}

async function validateOffer() {
  const postSubscriptionRequest = getPostSubscriptionRequest(
    props.accountNumber,
    props.accountId,
    props.userEmail,
    principalContact.value,
    currentSubscriptionOffer.value,
    selectedProducts.value
  )
  if (postSubscriptionRequest) {
    await createSubscriptionRequestNew(postSubscriptionRequest)
  }
}

const handleConfirm = async () => {
  await validateOffer()
  modalConfirmationVisible.value = false

  // To ensure a good user experience, as closing two things simultaneously is not ideal
  setTimeout(() => {
    onCloseOffersDrawer()
  }, 600)
}

function onClickNext() {
  if (isSubmitButton.value) {
    modalConfirmationVisible.value = true
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

onMounted(async () => {
  subscriptionOffers.value = await getAllOffers()
  principalContact.value = await getPrincipalContact()
  account.value = await fetchAccount(props.accountId)
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
