<template>
  <div>
    <ConfirmationModal
      v-model="confirmationModalVisible"
      :title="t('confirmationTitle')"
      :content="t('confirmationContent')"
      @confirm="handleConfirm"
      data-testid="confirmation-modal"
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
          v-if="offerSanitizedUrl"
          class="offers-drawer__details margin-left--4"
        >
          <PIcon color="#5546FF" size="16">
            <PILink45deg />
          </PIcon>
          <a
            class="offers-drawer__details-link font-base link margin-left--1"
            :href="offerSanitizedUrl"
            target="_blank"
          >
            {{ sanitizedOffersDrawerLink.titleLink }}
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
          <ul
            v-if="
              activeStep === offerStepperStep.CUSTOMERS &&
                principalContacts?.length
            "
            class="offers-drawer__contact-list"
          >
            <li
              v-for="principalContact in principalContacts"
              :key="principalContact.contactId"
              class="margin-bottom--6"
            >
              <PrincipalContact
                :principalContact="principalContact"
                data-testid="customers-step"
              />
            </li>
          </ul>
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
            v-model="notes[activeStep]"
            :key="activeStep"
            class="margin-top--6"
          />
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

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { sanitizeUrl } from '@braintree/sanitize-url'
import { get } from 'lodash-es'
import { PDrawer, PSteps, PStep, PIcon, PILink45deg } from '@kpmg/styleguide'
import SubscriptionOffers from '../SubscriptionOffers'
import OfferSubscription from '../OfferSubscription'
import StepNote from '../StepNote'
import PrincipalContact from '../PrincipalContact'
import CompanyInformation from '../CompanyInformation'
import NextPreviousButtons from '../NextPreviousButtons'
import ConfirmationModal from '../ConfirmationModal'
import ManageCollaborators from '../ManageCollaborators'
import {
  getAllOffers,
  getOffer,
  getOffersBookLink,
  getPrincipalContacts,
} from '@/services/offer'
import { addPathValue, getPatchOperations } from '@/services/PatchRecordService/PatchRecordService'
import { type PatchValue } from '@/services/PatchRecordService'
import { offerStepperStep } from './OffersDrawerTypes'
import type { Note } from '@/pages/subscriptions/SubscriptionsTypes'
import type { OffersDrawerProps, SelectedProduct } from './OffersDrawerTypes'
import { fetchAccount, patchAccount, type Account } from '@/services/account'
import {
  addSelectedProduct,
  removeSelectedProduct,
  getInitialSelectedProducts,
  getPostSubscriptionRequest,
} from './utils/OffersDrawerUtils'
import type { User } from '../PrincipalContact/PrincipalContactTypes'
import type {
  SubscriptionOffer,
  SubscriptionOfferServices,
} from '../SubscriptionOffers/SubscriptionOffersTypes'
import type { ProviderFormName } from '../CompanyInformation/CompanyInformationTypes'
import { createSubscriptionRequestNew } from '@/pages/subscriptions/SubscriptionsServices'
import { ACCOUNT_ID } from './OffersDrawerConst'
import type { Contact } from '@/services/contact/contactTypes'

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

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const props = defineProps<OffersDrawerProps>()

const currentSubscriptionOffer = ref<SubscriptionOfferServices | undefined>()
const patchValues: PatchValue[] = []
const selectedProducts = ref<SelectedProduct[]>([])
const subscriptionOffers = ref<SubscriptionOffer[]>([])
const collaborators = ref<Contact[]>([])
const principalContacts = ref<User[] | undefined>()
const account = ref<Account | undefined>()
const notes = ref<Note[]>([])
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
    currentSubscriptionOffer.value,
    selectedProducts.value,
    notes.value,
  )
  if (postSubscriptionRequest) {
    await createSubscriptionRequestNew(postSubscriptionRequest)
  }
}

async function validateOffer() {
  const patchOperations = getPatchOperations(patchValues)
  if (patchOperations.length > 0) {
    try {
      await patchAccount(props.accountId, patchOperations)
    } catch (error) {
      console.error(error)
    }
  }
  try {
    await saveOffer()
  } catch (error) {
    console.error(error)
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
  if (activeStep.value === offerStepperStep.COLLABORATORS && collaborators.value.length === 0) {
    console.warn('No collaborator')
    return
  }
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

const providerName = computed((): ProviderFormName => {
  return (
    currentSubscriptionOffer.value &&
    (currentSubscriptionOffer.value?.providers
      .filter((item) => item.providerName !== 'PULSE')
      .at(0)?.providerName as 'MEG' | 'LOOP')
  )
})

const offerSanitizedUrl = computed(() => {
  return sanitizedOffersDrawerLink.value.link
    ? sanitizeUrl(sanitizedOffersDrawerLink.value.link)
    : ''
})

onMounted(async () => {
  subscriptionOffers.value = await getAllOffers()
  principalContacts.value = await getPrincipalContacts()
  account.value = await fetchAccount(ACCOUNT_ID /* props.accountId */)
})
</script>

<style lang="scss" scoped>
.offers-drawer {
  &__company-name {
    color: var(--el-text-color-secondary);
  }
  &__contact-list {
    list-style: none;
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
  confirmationTitle: 'Attention'
  confirmationContent: >
    After confirmation, the offer activation request will be submitted,
    and there will be no option to revert. Please review your information
    carefully before proceeding.
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
  confirmationContent: >
    Une fois confirmée, la demande d'activation d'offre sera créée
    et vous ne pourrez plus revenir en arrière.
    Veuillez donc vérifier vos informations avant de valider.
</i18n>
