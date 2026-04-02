<template>
  <div class="padding-top--4">
    <MepPlannerTicketsInput
      v-model="workItemIdsInput"
      :isLoading="isLoading"
      :canSearch="canSearchTickets"
      @search="searchTicketsToRepos"
    />

    <MepPlannerResults
      v-if="ticketsResult !== null || isLoading === true || error !== null"
      :ticketsResult="ticketsResult"
      :isLoading="isLoading"
      :error="error"
      :warnings="ticketsResult?.warnings ?? []"
      :loadingProgress="loadingProgress"
      :mepReadiness="mepReadiness"
      :isCheckingReadiness="isCheckingReadiness"
      class="margin-top--6"
      @check-readiness="checkMepReadiness"
    />
  </div>
</template>

<script setup lang="ts">
import { useMepPlanner } from './use-mep-planner.composable'
import MepPlannerTicketsInput from './mep-planner-tickets-input.vue'
import MepPlannerResults from './mep-planner-results.vue'

const {
  workItemIdsInput,
  isLoading,
  loadingProgress,
  error,
  ticketsResult,
  canSearchTickets,
  searchTicketsToRepos,
  mepReadiness,
  isCheckingReadiness,
  checkMepReadiness,
} = useMepPlanner()
</script>
