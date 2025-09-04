<template>
  <PDialog
    :modelValue="isDialogVisible"
    pWidth="420px"
    pModal
    @close="handleCloseDialog"
  >
    <div class="flex flex--justify-content-center">
      <h3 class="h3 font-semibold">
        {{ t('missionDescription') }}
      </h3>
    </div>

    <div class="margin-y--4">
      <p>{{ t('biDashboardSupport') }}</p>
    </div>

    <div>
      <p class="font-semibold">
        {{ t('financialIndicatorsIntro') }}
      </p>
      <ul class="padding-x--6">
        <li>{{ t('financialIndicators.cashFlow') }}</li>
        <li>{{ t('financialIndicators.performance') }}</li>
        <li>{{ t('financialIndicators.hr') }}</li>
      </ul>
    </div>

    <div class="margin-y--4">
      <p>
        <span class="font-semibold">{{ t('dashboardAccess.overview') }}</span>
        {{ t('dashboardAccess.limitation') }}
      </p>
    </div>

    <div class="margin-bottom--4">
      <PCheckbox
        ref="checkbox"
        v-model="acceptOfferTerms"
        data-testid="smart-offer-terms-checkbox"
      >
        <div class="margin-top--4">
          {{ t('acceptOffer.text') }}
          <a
            href="#"
            target="_blank"
            class="text-underline"
            aria-label="Voir les conditions de l'offre"
          >
            {{ t('acceptOffer.seeConditions') }}
          </a>
        </div>
      </PCheckbox>
    </div>

    <template #footer>
      <PButton
        :disabled="acceptOfferTerms !== true"
        pType="primary"
        pSize="small"
        data-testid="smart-offer-accept-button"
        @click="handleAcceptOffer"
      >
        {{ t('acceptTerms') }}
      </PButton>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDialog, PButton, PCheckbox } from '@pulse/styleguide/components'
import { ActivateTrialOfferDialogProps } from './activate-trial-offer-dialog.type'

defineProps<ActivateTrialOfferDialogProps>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const acceptOfferTerms = ref(false)
const isDialogVisible = defineModel<boolean>({ default: false })

const handleCloseDialog = () => {
  isDialogVisible.value = false
}

const handleAcceptOffer = () => {
  // ✅ TODO: Call API to activate trial offer
}
</script>

<i18n lang="yaml">
en-US:
  financialIndicatorsIntro: "The financial indicators presented will be:"
  financialIndicators:
    cashFlow: "Cash flow: receipts, disbursements, outstanding amounts, debts, etc."
    performance: "Performance: revenue, payroll, etc."
    hr: "HR: FTE, absenteeism, etc."
  missionDescription: "Mission description"
  dashboardAccess:
    overview: >
      From this dynamic BI dashboard, you will have the ability to access a detailed view of the desired items.
    limitation: >
      Potential requests for enrichment in terms of indicators and analytical axes are not covered by this proposal.
  biDashboardSupport: >
    To support you in managing your business, we offer — in addition to our current engagement —
    services for providing key performance indicators on a dynamic BI dashboard.
    Our work will consist of delivering management indicators via a Business Intelligence (BI) tool
    integrated with your RYDGE platform.
  acceptOffer:
    text: "I accept the conditions related to the SMART offer,"
    seeConditions: "see conditions"
  acceptTerms: "I have read and accept the conditions related to the offer"

fr-FR:
  financialIndicatorsIntro: "Les indicateurs financiers présentés seront :"
  missionDescription: "Description de la mission"
  financialIndicators:
    cashFlow: "Trésorerie : encaissements, décaissements, encours, dettes, etc."
    performance: "Performance : chiffre d'affaires, masse salariale, etc."
    hr: "RH : ETP, absentéisme, etc."
  dashboardAccess:
    overview: >
      Depuis ce tableau de bord BI dynamique, vous aurez la possibilité
      d'accéder à une vision détaillée des postes souhaités.
    limitation: >
      Les potentielles demandes d'enrichissement en matière d'indicateurs et
      d'axes analytiques ne sont pas couvertes par la présente proposition.
  biDashboardSupport: >
    Pour vous accompagner dans la gestion de votre activité, nous vous proposons en complément de notre
    mission actuelle les prestations de mise à disposition d'indicateurs sur un tableau de bord BI dynamique.
    Nos travaux consisteront à vous proposer la mise à disposition d'indicateurs de gestion via un outil
    de BI (Business Intelligence) depuis votre plateforme RYDGE.
  acceptOffer:
    text: "J'accepte les conditions liées à l'offre SMART,"
    seeConditions: "voir les conditions"
  acceptTerms: "J'ai lu et j'accepte les conditions liées à l'offre"
</i18n>
