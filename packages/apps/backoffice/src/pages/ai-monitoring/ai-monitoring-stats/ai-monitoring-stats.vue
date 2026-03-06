<template>
  <div
    class="
      ai-monitoring-stats
      flex
      flex-gap--4
    "
  >
    <Transition
      name="fade-scale"
      mode="out-in"
    >
      <div
        v-if="isLoading"
        key="loading"
        class="
          ai-monitoring-stats__loader
          flex
          flex--justify-content-center
          flex--align-items-center
          width--100
        "
      >
        <PLoader
          pType="primary"
          pSize="large"
        />
      </div>

      <div
        v-else
        key="loaded"
        class="
          ai-monitoring-stats__grid
          flex
          flex-gap--4
          width--100
        "
      >
        <div class="ai-monitoring-stats__card stagger-fade-up">
          <PStatCard
            pTitle="Utilisation"
            :pValue="formattedTotalCalls"
            pDescription="Nombre total d'appels"
            pIcon="barChart"
          />
        </div>
        <div class="ai-monitoring-stats__card stagger-fade-up">
          <PStatCard
            pTitle="Coût total"
            :pValue="formattedTotalCost"
            pDescription="sur la sélection actuelle"
            pIcon="currencyEuro"
          />
        </div>
        <div class="ai-monitoring-stats__card stagger-fade-up">
          <PStatCard
            pTitle="Temps moyen"
            :pValue="formattedAverageTime"
            pDescription="Latence moyenne de réponse"
            pIcon="clock"
          />
        </div>
        <div class="ai-monitoring-stats__card stagger-fade-up">
          <PStatCard
            pTitle="Satisfaction"
            :pValue="formattedSatisfactionRate"
            pDescription="Taux d'avis positif"
            pIcon="thumbsUp"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PLoader, PStatCard } from '@pulse/styleguide/components'
import type { AiMonitoringStatsProps } from './ai-monitoring-stats.type'
import {
  formatTotalCalls,
  formatTotalCost,
  formatAverageTime,
  formatSatisfactionRate,
} from './ai-monitoring-stats.utils'

const props = defineProps<AiMonitoringStatsProps>()

const formattedTotalCalls = computed(() => {
  if (props.summary === null) {
    return '-'
  }
  return formatTotalCalls(props.summary.total_calls)
})

const formattedTotalCost = computed(() => {
  if (props.summary === null) {
    return '-'
  }
  return formatTotalCost(props.summary.total_cost)
})

const formattedAverageTime = computed(() => {
  if (props.summary === null) {
    return '-'
  }
  return formatAverageTime(props.summary.average_time)
})

const formattedSatisfactionRate = computed(() => {
  if (props.summary === null) {
    return '-'
  }
  return formatSatisfactionRate(props.summary.satisfaction_rate)
})
</script>

<style scoped lang="scss">
.ai-monitoring-stats {
  &__grid {
    width: 100%;
  }

  &__card {
    flex: 1;
    min-width: 0;
  }

  &__loader {
    min-height: 150px;
  }
}
</style>
