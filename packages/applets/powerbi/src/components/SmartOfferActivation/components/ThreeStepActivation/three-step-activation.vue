<template>
  <section
    class="width--100"
  >
    <h2 class="h2 margin-bottom--6">
      {{ t('activationStepsTitle') }}
    </h2>
    <div
      class="three-steps-activation__cards-wrapper flex flex-gap--6"
      role="list"
    >
      <SmartOfferCard
        v-for="(card, index) in activationCards"
        :key="index"
        :title="card.title"
        :subtitle="card.subtitle"
        :description="card.description"
        :darkMode="true"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ReportingManager } from '@pulse/common/managers'
import type { SmartOfferCardProps } from '../SmartOfferCard/smart-offer-card.type'
import SmartOfferCard from '../SmartOfferCard/smart-offer-card.vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

// POC: Static demo data for Smart offer cards. No translation planned yet.
const smartOfferPrice = ReportingManager.calculateSmartOfferPrice()
const activationCards: SmartOfferCardProps[] = [
  {
    title: 'ÉTAPE 1 : ACTIVATION INSTANTANÉE',
    subtitle: 'Accès immédiat à votre tableau de bord',
    description:
      "Un clic et c'est parti ! Accédez directement à vos 3 modules BI avec vos données pré-configurées. Votre tableau de bord est opérationnel en quelques minutes.",
  },
  {
    title: 'ÉTAPE 2 : ACCOMPAGNEMENT',
    subtitle: 'Accompagnement de votre conseiller',
    description:
      'Nous vous proposons des rendez-vous dédiés pour exploiter pleinement vos données et vous accompagner dans votre prise de décisions et la mise en œuvre de vos projets.',
  },
  {
    title: 'ÉTAPE 3 : DÉCISION LIBRE APRÈS 3 MOIS',
    subtitle: 'Testez sans engagement',
    description:
      `Au bout de 3 mois, vous décidez ! Vous continuez à profiter de votre tableau de bord pour ${smartOfferPrice} €/mois sans engagement ou vous annulez sans frais. Vous pourrez également découvrir nos tableaux de bord premium pour optimiser votre pilotage (trésorerie prédictive, benchmark, indicateurs sectoriels).`,
  },
]
</script>

<style lang="scss" scoped>
.three-steps-activation__cards-wrapper {
  @media screen and (max-width: 992px) {
    flex-direction: column;
    align-items: center;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    activationStepsTitle: "Activation in 3 simple steps"
  fr-FR:
    activationStepsTitle: "Activation en 3 étapes simples"
</i18n>
