<template>
  <div>
    <PAlert
      v-if="mepReadiness.status === MepReadinessStatus.Ready"
      pType="success"
      class="margin-bottom--4"
    >
      La MEP est prête. Toutes les cibles sont taggées et déployées en recette.
    </PAlert>

    <PAlert
      v-else-if="mepReadiness.status === MepReadinessStatus.ReadyWithRisk"
      pType="warning"
      class="margin-bottom--4"
    >
      <p class="font-bold margin-bottom--2">
        La MEP est possible, mais vous embarquez des US supplémentaires :
      </p>
      <ul class="margin--0 padding-left--4">
        <li
          v-for="wi in mepReadiness.extraWorkItems"
          :key="wi.id"
        >
          <a
            :href="wi.webUrl"
            target="_blank"
          >
            #{{ wi.id }}
          </a>
          — {{ wi.title }}
          <PTag
            :pContent="wi.state"
            pSize="small"
          />
        </li>
      </ul>
    </PAlert>

    <PAlert
      v-else-if="mepReadiness.status === MepReadinessStatus.NotReady"
      pType="error"
      class="margin-bottom--4"
    >
      <p class="font-bold margin-bottom--2">
        La MEP n'est pas prête.
      </p>
      <ul
        v-if="mepReadiness.reposNotReady.length > 0"
        class="margin--0 padding-left--4"
      >
        <li
          v-for="repo in mepReadiness.reposNotReady"
          :key="repo"
        >
          {{ repo }} — pas de version taggée
        </li>
      </ul>
    </PAlert>
  </div>
</template>

<script setup lang="ts">
import { PAlert, PTag } from '@pulse/styleguide/components'
import { MepReadinessStatus } from './mep-planner.enum'
import type { MepReadinessResult } from './mep-planner.type'

defineProps<{
  mepReadiness: MepReadinessResult
}>()
</script>
