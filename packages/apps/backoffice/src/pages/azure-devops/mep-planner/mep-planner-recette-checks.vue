<template>
  <div
    v-if="recetteChecks.length > 0"
    class="margin-bottom--4"
  >
    <h4
      class="
        font-small
        font-bold
        margin-bottom--2
      "
    >
      Vérification recette
    </h4>
    <div
      v-for="check in recetteChecks"
      :key="check.repositoryName"
      class="margin-bottom--2"
    >
      <div
        class="
          flex
          flex--align-items-center
          flex-gap--2
        "
      >
        <PIcon
          :pName="getRecetteCheckIcon(check)"
          pSize="14"
          :class="getRecetteCheckIconClass(check)"
        />
        <span class="font-bold">{{ check.repositoryName }}</span>
        <span
          v-if="check.pipelineName !== null"
          class="font-small text-color--neutral-gray-400"
        >
          {{ check.pipelineName }}
        </span>
      </div>

      <!-- No pipeline found -->
      <p
        v-if="check.pipelineName === null"
        class="
          font-small
          text-color--neutral-gray-500
          margin-left--5
          margin-top--1
        "
      >
        Aucune pipeline .Delivery trouvée
      </p>

      <!-- No build found -->
      <p
        v-else-if="check.buildId === null"
        class="
          font-small
          text-color--neutral-gray-500
          margin-left--5
          margin-top--1
        "
      >
        Aucun build trouvé pour ce commit
      </p>

      <!-- Build found but no deploy stages → show fallback -->
      <div v-else-if="check.fallbackBuild !== null">
        <div
          class="
            flex
            flex--align-items-center
            flex-gap--2
            margin-left--5
            margin-top--1
          "
        >
          <span class="font-small">
            Build cible
            <a
              :href="check.buildUrl ?? undefined"
              target="_blank"
            >#{{ check.buildNumber }}</a>
            — pas de stage de déploiement.
          </span>
        </div>
        <div
          class="
            flex
            flex--align-items-center
            flex-gap--2
            margin-left--5
            margin-top--1
          "
        >
          <PIcon
            :pName="check.fallbackBuild.recetteDeployed === true ? 'check' : 'xCircle'"
            pSize="14"
            :class="check.fallbackBuild.recetteDeployed === true ? 'text-color--success-500' : 'text-color--warning-500'"
          />
          <span class="font-small">
            Build alternatif
            <a
              :href="check.fallbackBuild.buildUrl"
              target="_blank"
            >#{{ check.fallbackBuild.buildNumber }}</a>
            (embarque d'autres modifications)
          </span>
          <PTag
            v-if="check.fallbackBuild.recetteDeployed === true"
            pColor="success"
            pSize="small"
            pContent="Déployé en recette"
          />
          <PTag
            v-else
            pColor="warning"
            pSize="small"
            :pContent="`Stage: ${check.fallbackBuild.lastStageName ?? '?'}`"
          />
        </div>
      </div>

      <!-- Build found with stages, show status -->
      <div
        v-else
        class="
          flex
          flex--align-items-center
          flex-gap--2
          margin-left--5
          margin-top--1
        "
      >
        <a
          :href="check.buildUrl ?? undefined"
          target="_blank"
          class="font-small"
        >#{{ check.buildNumber }}</a>
        <PTag
          v-if="check.recetteDeployed === true"
          pColor="success"
          pSize="small"
          pContent="Déployé en recette"
        />
        <PTag
          v-else
          pColor="warning"
          pSize="small"
          :pContent="`Stage: ${check.lastStageName ?? '?'}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PIcon, PTag } from '@pulse/styleguide/components'
import type { MepRecetteCheck } from './mep-planner.type'
import {
  getRecetteCheckIcon,
  getRecetteCheckIconClass,
} from './mep-planner-results.helper'

defineProps<{
  recetteChecks: MepRecetteCheck[]
}>()
</script>
