<template>
  <KeyMomentsReader
    :entity="entity"
    :caption="caption"
    :screens="screens"
    :offers="offers"
    :isInThousands="isInThousands"
    :hasReport="hasReport"
    :canExport="canExport"
    :hasUnitSelect="hasUnitSelect"
    :exerciceOptions="hasExerciceSelect ? exerciceOptions : undefined"
    :selectedExerciceId="selectedExerciceId"
    :exerciceYear="exerciceYear"
    @select-exercice="selectExercice"
    @toggle-thousands="toggleThousands"
  >
    <!-- Handed to the reader only while there is nothing to read yet -->
    <template
      v-if="hasReport === false"
      #report
    >
      <div
        v-if="isLoading"
        class="
          flex
          flex--justify-content-center
          margin-top--8
        "
        data-testid="customer-key-moments-loader"
      >
        <PLoader pType="primary" pSize="50" />
      </div>

      <PAlert
        v-else-if="hasError"
        class="margin-top--6"
        pType="error"
        data-testid="customer-key-moments-error"
      >
        {{ t('keyMoments.customer.error') }}
      </PAlert>

      <!--
        Nothing published, nothing published on this exercice, or a domain
        switched off: three absences the reader has no way to act on, and
        which therefore read as one neutral state rather than as a failure.
      -->
      <PAlert
        v-else
        class="margin-top--6"
        pType="info"
        data-testid="customer-key-moments-empty"
      >
        {{ t('keyMoments.customer.empty') }}
      </PAlert>
    </template>
  </KeyMomentsReader>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { RouteParam } from '@pulse/common/enums'
import { RouterHelpers } from '@pulse/common/helpers'
import { PAlert, PLoader } from '@pulse/styleguide/components'
import { formatCalendarDay, formatCalendarYear, formatInstant } from '../../utils/date.utils'
import { buildExerciceOptions } from '../../utils/format.utils'
import KeyMomentsReader from './key-moments-reader.vue'
import { useCustomerKeyMoments } from './customer-key-moments.composable'

const { t } = useI18n()
const route = useRoute()

/**
 * Four flags say the page is being read through the preview rather than by its
 * client, and the client app binds none of them: `isTracked` is off, since what
 * analytics count is a client displaying their key moment; `canExport` is on,
 * since handing the publication over as a file is a collaborator's gesture;
 * `hasExerciceSelect` is off, since the banner of the preview draws the selector
 * itself, above the page rather than inside it; and `hasUnitSelect` is off,
 * since the unit was settled before the report got there.
 */
const {
  isTracked = true,
  canExport = false,
  hasExerciceSelect = true,
  hasUnitSelect = true,
} = defineProps<{
  isTracked?: boolean
  canExport?: boolean
  hasExerciceSelect?: boolean
  hasUnitSelect?: boolean
}>()

/**
 * The exercice on screen, offered to whoever embeds this page — the mirror view
 * the collaborator reads it through needs to know which publication it is
 * showing. The client app binds nothing, and the page opens on its own default.
 */
const exerciceId = defineModel<number>('exerciceId')

const {
  isLoading,
  hasError,
  isEmpty,
  screens,
  offers,
  entity,
  exerciceCatalogue,
  selectedExerciceId,
  publishedAt,
  locale,
  isInThousands,
  selectExercice,
  toggleThousands,
} = useCustomerKeyMoments(
  RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID),
  exerciceId.value,
  { isTracked },
)

/**
 * Watched rather than emitted from the dropdown: two gestures settle the
 * exercice — the initial load, which picks it, and the reader choosing another.
 */
watch(selectedExerciceId, (openedExerciceId) => {
  exerciceId.value = openedExerciceId
})

/**
 * An exercice is named by the year it closes on, as the collaborator surface
 * names it. Its two dates are not lost: the caption states them in full.
 */
const exerciceOptions = computed(
  () => buildExerciceOptions(exerciceCatalogue.value, t, locale.value),
)

const selectedExercice = computed(() => exerciceCatalogue.value
  .find(summary => summary.exerciceId === selectedExerciceId.value))

/**
 * Which exercice is on screen, and when the firm published it. The report says
 * nothing of who published it, nor of which delivery it was drawn from: a
 * published key moment engages the firm, not one of its people.
 */
const caption = computed(() => {
  const exercice = selectedExercice.value

  return [
    exercice === undefined ? undefined : t('keyMoments.customer.caption.exercice', {
      start: formatCalendarDay(exercice.exerciceStartDate, locale.value),
      end: formatCalendarDay(exercice.exerciceEndDate, locale.value),
    }),
    publishedAt.value === undefined ? undefined : t('keyMoments.customer.caption.publishedAt', {
      date: formatInstant(publishedAt.value, locale.value),
    }),
  ].filter((part): part is string => part !== undefined)
})

/** Named the way the selector names it, so the file and the screen agree. */
const exerciceYear = computed(() => (selectedExercice.value === undefined
  ? undefined
  : formatCalendarYear(selectedExercice.value.exerciceEndDate, locale.value)))

const hasReport = computed(() => isLoading.value === false
  && hasError.value === false
  && isEmpty.value === false)

/**
 * The exercice selector, offered to whoever embeds this page rather than kept
 * inside it — the preview draws it in its banner, and both the choices and the
 * gesture must come from the page they command. Reading them from a second
 * source would be offering an exercice this page may not be able to open.
 */
defineExpose({ exerciceOptions, selectedExerciceId, selectExercice })
</script>
