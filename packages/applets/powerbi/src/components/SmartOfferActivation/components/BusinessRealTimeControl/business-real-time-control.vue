<template>
  <section
    class="business-real-time margin-bottom--10 width--100"
  >
    <h2 class="h2 margin-bottom--6">
      {{ t('dashboardTitle') }}
    </h2>
    <div
      class="business-real-time__cards-wrapper flex flex-gap--6"
      role="list"
    >
      <SmartOfferCard
        v-for="(card, index) in businessRealTimeCards"
        :key="index"
        :title="card.title"
        :subtitle="card.subtitle"
        :description="card.description"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { SmartOfferCardProps } from '../SmartOfferCard/smart-offer-card.type'
import SmartOfferCard from '../SmartOfferCard/smart-offer-card.vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      dashboardTitle: 'Manage your business in real time',
    },
    'fr-FR': {
      dashboardTitle: 'Pilotez votre entreprise en temps réel',
    },
  },
})

// POC: Static demo data for Smart offer cards. No translation planned yet.
const businessRealTimeCards: SmartOfferCardProps[] = [
  {
    title: 'TRÉSORERIE',
    subtitle: 'Maîtrisez votre cash-flow',
    description: 'Anticipez vos besoins financiers et réduisez les délais clients.',
  },
  {
    title: "PERFORMANCE D'ENTREPRISE",
    subtitle: 'Pilotez votre stratégie',
    description:
      'Identifiez vos leviers de performance, optimisez votre rentabilité grâce à des KPIs centralisés et analysez votre évolution.',
  },
  {
    title: 'RH & ORGANISATION',
    subtitle: 'Optimisez votre capital humain',
    description: 'Maîtrisez votre masse salariale, détectez les signaux faibles et anticipez vos recrutements.',
  },
]
</script>

<style lang="scss" scoped>
.business-real-time__cards-wrapper {
  @media screen and (max-width: 992px) {
    flex-direction: column;
    align-items: center;
  }
}
</style>

