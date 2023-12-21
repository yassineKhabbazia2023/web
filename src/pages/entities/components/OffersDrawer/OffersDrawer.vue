<template>
  <div>
    <PDrawer
      v-model="internalIsOpened"
      :pTitle="t('drawerTitle')"
      :pShowPreviousStep="false"
      pSize="50%"
      pDirection="rtl"
      class="drawer"
      @close-drawer-button="closeOffersDrawer"
      data-ut="drawer"
    >
      <template v-if="internalIsOpened">
        <div v-if="!!currentSubscriptionOffer">
          <PSteps
            v-if="currentSubscriptionOffer?.approvalRequired"
            :active="activeStep"
            :direction="offerStepperConfig.direction"
            :processStatus="offerStepperConfig.processStatus"
            :finishStatus="offerStepperConfig.finishStatus"
            class="margin-bottom--9"
            data-ut="offer-stepper"
          >
            <PStepItem :title="offerStepTitles.services" />
            <PStepItem :title="offerStepTitles.users" />
            <PStepItem :title="offerStepTitles.information" />
          </PSteps>
          <OfferSubscription
            v-if="activeStep === offerStepperStep.SERVICES"
            data-ut="offer"
            :subscriptionOffer="currentSubscriptionOffer"
          />
          <p
            v-else-if="activeStep === offerStepperStep.USERS"
          ></p>
          <p
            v-else-if="
              activeStep === offerStepperStep.INFORMATION
            "
          ></p>
        </div>
        <SubscriptionOffers
          v-else
          data-ut="offers"
          :subscriptionOffers="subscriptionOffers"
          @select-offer="onSelectOffer"
        />
      </template>
      <template #footer>
        <NextPreviousButtons
          v-if="!!currentSubscriptionOffer"
          :hasCheckIcon="isSubmitButton"
          data-ut="nextPreviousButtons"
          :previousLabel="t('previousLabel')"
          :nextLabel="nextLabel"
          @click-previous="onClickPrevious"
          @click-next="onClickNext"
        />
      </template>
    </PDrawer>
  </div>
</template>

<i18n lang="yaml">
en-US:
  drawerTitle: 'Offers available on this folder'
  previousLabel: 'Previous'
  nextLabel: 'Next'
  submitLabel: 'Submit'
  services: 'Services'
  users: 'Users'
  information: 'Information'
fr-FR:
  drawerTitle: 'Offres activables sur ce dossier'
  previousLabel: 'Précédent'
  nextLabel: 'Suivant'
  submitLabel: 'Valider'
  services: 'Services'
  users: 'Utilisateurs'
  information: 'Informations'
</i18n>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PSteps, PStepItem } from '@kpmg/styleguide'
import type { OffersDrawerProps } from './OffersDrawerTypes'
import { offerStepperStep } from './OffersDrawerTypes'
import SubscriptionOffers from '../SubscriptionOffers'
import OfferSubscription from '../OfferSubscription'
import NextPreviousButtons from '../NextPreviousButtons'
import type {
  SubscriptionOffer,
  SubscriptionOfferServices
} from '../SubscriptionOffers/SubscriptionOffersTypes'
import { getAllOffers, getOffer } from '@/services/offer'

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
  users: t('users'),
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
const subscriptionOffers = ref<SubscriptionOffer[]>([])

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
    return
  }
  currentSubscriptionOffer.value = await getOffer(selectedOfferId)
}

const nextLabel = computed((): string => {
  return isSubmitButton.value ? t('submitLabel') : t('nextLabel')
})

function onClickPrevious() {
  if (activeStep.value > offerStepperStep.SERVICES) {
    --activeStep.value
  } else {
    setSelectedOffer()
  }
}

function onClickNext() {
  if (
    activeStep.value < offerStepperStep.INFORMATION &&
    currentSubscriptionOffer.value?.approvalRequired
  ) {
    ++activeStep.value
  }
}

function onSelectOffer(offerId: number) {
  setSelectedOffer(offerId)
}

const closeOffersDrawer = () => {
  internalIsOpened.value = false
}

onMounted(async () => {
  subscriptionOffers.value = await getAllOffers()
})
</script>
