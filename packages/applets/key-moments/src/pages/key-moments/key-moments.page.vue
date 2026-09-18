<template>
  <div
    class="
      key-moments
      flex
      flex--direction-column
    "
  >
    <section class="key-moments__content">
      <div
        class="
          key-moments__header
          flex
          flex--wrap
          flex--align-items-center
          flex--justify-content-space-between
          flex-gap--4
        "
      >
        <PTitle>
          <i18n-t
            v-if="entity !== undefined"
            keypath="keyMoments.titleOf"
            scope="global"
            tag="span"
          >
            <template #name>
              <span class="key-moments__entity-name text-color--jungle-400">
                {{ entity.name }}
              </span>
            </template>
          </i18n-t>
          <template v-else>
            {{ t('keyMoments.title') }}
          </template>
        </PTitle>

        <div
          class="
            flex
            flex--wrap
            flex--align-items-center
            flex-gap--2
          "
        >
          <div
            class="
              key-moments__published-state
              flex
              flex--direction-column
              flex--align-items-flex-end
              flex--shrink-0
              no-wrap
              font-small
              text-color--text-neutral
            "
            data-testid="key-moments-published-state"
          >
            <span
              v-for="line in publishedStateLines"
              :key="line"
            >
              {{ line }}
            </span>

            <span
              v-if="publishBlockedReason !== undefined"
              class="text-color--text-error"
              data-testid="key-moments-publish-blocked"
            >
              {{ publishBlockedReason }}
            </span>

            <ModificationsPanel
              :modifications="modifications"
              :revertingKind="revertingKind"
              @revert="revertDivergence"
            />
          </div>
          <PButton
            v-if="hasReport"
            pSize="small"
            pType="secondary"
            :pDisabled="isLoading || publicationState === PublicationState.UNKNOWN"
            pTestId="key-moments-preview-button"
            @click="openPreview"
          >
            {{ t(publicationState === PublicationState.UP_TO_DATE
              ? 'keyMoments.preview.publishedButton'
              : 'keyMoments.preview.openButton') }}
          </PButton>
          <!-- Disabled rather than hidden: a missing button reads as a missing right -->
          <PButton
            pSize="small"
            :pType="publicationState === PublicationState.DELIVERY ? 'secondary' : 'primary'"
            :pDisabled="isPublishDisabled"
            :pLoading="isPublishing"
            pTestId="key-moments-publish-button"
            @click="askPublish"
          >
            {{ publishButtonLabel }}
          </PButton>
        </div>
      </div>

      <div
        class="
          flex
          flex--wrap
          flex--align-items-center
          flex--justify-content-space-between
          flex-gap--4
          margin-top--4
        "
      >
        <div
          class="
            key-moments__deliveries
            flex
            flex--wrap
            flex--align-items-center
            flex-gap--2
          "
        >
          <PDropdown
            v-if="exerciceOptions.length > 0"
            class="key-moments__exercice-select"
            :modelValue="selectedExerciceId"
            :pOptions="exerciceOptions"
            :pAriaLabel="t('keyMoments.exerciceSelect.ariaLabel')"
            :pDisabled="isLoading"
            pSize="small"
            pTestId="key-moments-exercice-select"
            @update:model-value="exerciceId => selectExercice(exerciceId as number)"
          />
          <PDropdown
            v-if="closingOptions.length > 0"
            class="key-moments__closing-select"
            :modelValue="selectedClosingId"
            :pOptions="closingOptions"
            :pAriaLabel="t('keyMoments.closingSelect.ariaLabel')"
            :pDisabled="isLoading"
            pSize="small"
            pTestId="key-moments-closing-select"
            @update:model-value="closingId => selectClosing(closingId as number)"
          />
          <input
            ref="importInput"
            type="file"
            accept="application/json,.json"
            hidden
            data-testid="key-moments-import-input"
            @change="onImportFile"
          >
          <PButton
            pSize="small"
            pType="secondary"
            :pLoading="isImporting"
            pTestId="key-moments-import-button"
            @click="importInput?.click()"
          >
            {{ t('keyMoments.import.button') }}
          </PButton>
        </div>
      </div>

      <Filters
        class="margin-top--4"
        :templateModels="templateModelOptions"
        :selectedModelCode="selectedModelCode"
        :comparisonOptions="comparisonOptions"
        :selectedReferenceKey="selectedReferenceKey"
        :isInThousands="isInThousands"
        :disabled="isLoading"
        @select-model="selectModel"
        @select-comparison="selectComparison"
        @toggle-thousands="toggleThousands"
      />

      <div
        class="
          key-moments__body
          flex
          flex-gap--6
        "
      >
        <Nav
          v-if="hasNav"
          :screens="screens"
          :hasOffers="canSeeOffers"
        />

        <div class="key-moments__report">
          <div
            v-if="isLoading"
            class="
              flex
              flex--justify-content-center
              margin-top--8
            "
            data-testid="key-moments-loader"
          >
            <PLoader pType="primary" pSize="50" />
          </div>

          <PAlert
            v-else-if="hasError"
            class="margin-top--6"
            pType="error"
            data-testid="key-moments-error"
          >
            {{ t('keyMoments.error') }}
          </PAlert>

          <!-- A dossier never imported is a normal state, not a failure -->
          <PAlert
            v-else-if="hasNoClosing"
            class="margin-top--6"
            pType="info"
            data-testid="key-moments-empty"
          >
            {{ t('keyMoments.empty') }}
          </PAlert>

          <!-- Keyed on the reading: a new reading enters, an edit patches in place -->
          <div
            v-else
            :key="reportKey"
            class="key-moments__screens"
          >
            <section
              v-for="(screen, index) in screens"
              :id="screenAnchorId(screen.id)"
              :key="screen.id"
              class="key-moments__screen"
              :style="{ '--key-moments-enter-rank': index }"
              :class="{ 'key-moments__screen--hidden': screen.isHidden }"
              :data-testid="`key-moments-${screen.id}-screen`"
            >
              <SectionHead
                :rank="formatScreenRank(index)"
                :title="screen.title"
                :subtitle="screen.subtitle"
                :badge="isScreenHidden(screen) ? t('keyMoments.visibility.hiddenBadge') : undefined"
                :badgeTestId="`key-moments-${screen.id}-hidden-badge`"
                :data-testid="`key-moments-${screen.id}-screen-head`"
              />

              <div class="key-moments__grid">
                <Widget
                  v-for="(widget, widgetIndex) in screen.widgets"
                  :id="widgetAnchorId(widget.id)"
                  :key="widget.id"
                  :widget="widget"
                  :board="commentBoards[widget.id]"
                  :style="{
                    gridColumn: `span ${widget.span}`,
                    '--key-moments-enter-rank': widgetIndex,
                  }"
                  @save-comment="onSaveComment"
                  @retain-comment="retainVariant"
                  @discard-comment="discardSlot"
                  @toggle-visibility="toggleWidgetVisibility(widget.id)"
                />
              </div>
            </section>

            <OffersSection
              v-if="canSeeOffers"
              :offers="linkedOffers"
              :catalog="offersCatalog"
              :attachedIds="attachedOfferIds"
              :isAtCap="isOffersCapReached"
              :isSaving="isOffersSaving"
              :rank="formatScreenRank(screens.length)"
              :exerciceYear="selectedExerciceYear"
              :style="{ '--key-moments-enter-rank': screens.length }"
              @attach="onAttachOffer"
              @update="onUpdateOffer"
              @remove="onDetachOffer"
            />
          </div>
        </div>
      </div>
    </section>

    <PConfirmationPopup
      v-model:pIsVisible="isPublishPopupVisible"
      :pTitle="t('keyMoments.publish.popup.title')"
      :pConfirmButtonContent="t('keyMoments.publish.popup.confirm')"
      :pCancelButtonContent="t('keyMoments.publish.popup.cancel')"
      :pConfirmButtonIsLoading="isPublishing"
      :pWidth="popupWidth"
      pTestId="key-moments-publish-popup"
      @on-confirm-button-click="onPublish"
      @on-cancel-button-click="isPublishPopupVisible = false"
    >
      <p>{{ publishPopupMessage }}</p>
      <ul
        v-if="divergenceLabels.length > 0"
        class="
          key-moments-divergences
          list-style-none
          overflow-hidden
          margin-top--3
        "
        data-testid="key-moments-publish-divergences"
      >
        <li
          v-for="label in divergenceLabels"
          :key="label"
          class="
            key-moments-divergences__row
            padding-y--2
            padding-x--3
            font-small
            text-color--gray-500
          "
        >
          {{ label }}
        </li>
      </ul>
    </PConfirmationPopup>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { RouteName, RouteParam } from '@pulse/common/enums'
import { RouterHelpers } from '@pulse/common/helpers'
import { useResponsive } from '@pulse/styleguide'
import {
  PAlert,
  PButton,
  PConfirmationPopup,
  PDropdown,
  PLoader,
  PTitle,
} from '@pulse/styleguide/components'
import { PublicationState } from '../../enums/key-moments.enums'
import Filters from '../../components/filters/filters.vue'
import ModificationsPanel from '../../components/modifications-panel/modifications-panel.vue'
import Nav from '../../components/nav/nav.vue'
import OffersSection from '../../components/offers/offers-section.vue'
import SectionHead from '../../components/section-head/section-head.vue'
import Widget from '../../components/widget/widget.vue'
import { screenAnchorId, widgetAnchorId } from '../../utils/anchor.utils'
import { formatInstant } from '../../utils/date.utils'
import { formatScreenRank } from '../../utils/rank.utils'
import { useKeyMoments } from './key-moments.composable'
import { useOffers } from './offers.composable'
import { useComments } from './comments.composable'
import { usePublications } from './publication.composable'
import { usePublishState } from './publish-state.composable'
import { useKeyMomentsDraftStore } from '../../stores/key-moments-draft.store'
import { customerOffersOf, projectDraftDataset } from '../../utils/draft.utils'
import { useKeyMomentsEditionStore } from '../../stores/key-moments-edition.store'
import type { SaveSettlement, Screen } from '../../types/key-moments.types'
import type { LinkedOfferPayload } from '../../services/offers.service.types'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const { isMobile } = useResponsive()

const importInput = useTemplateRef<HTMLInputElement>('importInput')

const entityId = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)

const publications = usePublications(entityId)
const {
  publicationDetail,
  publicationOf,
  resolvePublishedPreferences,
  openExercice: readPublishedExercice,
} = publications

const {
  isPublishing,
  loadComments,
  saveComment,
  retainVariant,
  discardSlot,
  buildCommentBoards,
  buildPublishedComments,
  restorePublishedArbitration,
  publish,
} = useComments(entityId, publications)

const {
  isLoading,
  isImporting,
  hasError,
  hasNoClosing,
  entity,
  screens,
  reportRevision,
  templateCatalogue,
  isInThousands,
  comparisons,
  selectedReferenceKey,
  locale,
  templateModelOptions,
  selectedModelCode,
  exerciceOptions,
  exerciceCatalogue,
  selectedExerciceYear,
  closingOptions,
  comparisonOptions,
  hiddenWidgetIds,
  snapshotSources,
  toggleThousands,
  toggleWidgetVisibility,
  writeHiddenWidgets,
  selectComparison,
  selectedTemplateId,
  selectedExerciceId,
  closingCatalogue,
  selectedClosingId,
  selectTemplate,
  selectModel,
  selectExercice,
  selectClosing,
  importClosing,
} = useKeyMoments(entityId, resolvePublishedPreferences)

// Mounted whatever the permission: the attached list feeds the publication diff
const {
  linkedOffers,
  catalog: offersCatalog,
  canSeeOffers,
  isAtCap: isOffersCapReached,
  isSaving: isOffersSaving,
  attachedIds: attachedOfferIds,
  publishableSelection,
  publishedSnapshots,
  unresolvedIds: unresolvedOfferIds,
  loadOffers,
  attachOffer,
  detachOffer,
  updateOffer,
  restoreOffers: writeRestoredOffers,
} = useOffers(entityId)

// Watched: selecting, the initial load and an import all change the exercice
watch(selectedExerciceId, (exerciceId) => {
  if (exerciceId === undefined) {
    return
  }

  readPublishedExercice(exerciceId)
  loadOffers(exerciceId)
}, { immediate: true })

// Which readings would be published depends on the closing, even an undefined one
watch(selectedClosingId, (closingId) => {
  const exerciceId = selectedExerciceId.value

  if (exerciceId === undefined) {
    return
  }

  loadComments(exerciceId, closingId)
}, { immediate: true })

// Passing the exercice on every write keeps it from landing on the one just left
function onOfferGesture<Args extends unknown[], Result>(
  gesture: (exerciceId: number, ...args: Args) => Promise<Result>,
) {
  return async (...args: Args): Promise<Result | undefined> => {
    const exerciceId = selectedExerciceId.value

    if (exerciceId === undefined) {
      return undefined
    }

    return gesture(exerciceId, ...args)
  }
}

const onAttachOffer = onOfferGesture(attachOffer)
const onDetachOffer = onOfferGesture(detachOffer)
const restoreOffers = onOfferGesture(writeRestoredOffers)
const writeOfferUpdate = onOfferGesture(updateOffer)

// A note waits to be settled like a comment; a switch or a degree does not
async function onUpdateOffer(
  offerId: number,
  patch: Partial<LinkedOfferPayload>,
  settle?: SaveSettlement,
): Promise<void> {
  const isSaved = await writeOfferUpdate(offerId, patch)

  settle?.(isSaved === true)
}

async function onSaveComment(slotId: string, text: string, settle: SaveSettlement): Promise<void> {
  settle(await saveComment(slotId, text))
}

const openClosingVersion = computed(() => closingCatalogue.value
  .find(summary => summary.closingId === selectedClosingId.value)
  ?.version)

const commentBoards = computed(() => buildCommentBoards(
  screens.value,
  openClosingVersion.value,
))

// The microservice drops a section whose sub-sections are all hidden
function isScreenHidden(screen: Screen): boolean {
  return screen.isHidden
    || (screen.widgets.length > 0 && screen.widgets.every(widget => widget.isHidden))
}

// Reset so that picking the same corrected file again fires again
async function onImportFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file === undefined) {
    return
  }

  await importClosing(file)
  input.value = ''
}

const hasReport = computed(() => isLoading.value === false
  && hasError.value === false
  && hasNoClosing.value === false)

// No width for a side column on a phone, and stacked it pushes the report away
const hasNav = computed(() => hasReport.value && isMobile.value === false)

// The default dialog width is a share of the screen, too narrow on a phone
const popupWidth = computed(() => (isMobile.value ? 'calc(100vw - 24px)' : undefined))

const {
  publishContext,
  divergenceLabels,
  modifications,
  publicationState,
  publishedStateLines,
  isPublishDisabled,
  publishBlockedReason,
  publishButtonLabel,
  publishPopupMessage,
  revertingKind,
  revertDivergence,
} = usePublishState(
  {
    templateCatalogue,
    closingCatalogue,
    comparisons,
    screens,
    hiddenWidgetIds,
    publishableSelection,
    unresolvedOfferIds,
    selectedTemplateId,
    selectedClosingId,
    selectedReferenceKey,
    selectedExerciceId,
    isInThousands,
    hasReport,
    publicationDetail,
    publicationOf,
    buildPublishedComments,
    formatInstant: (date: string) => formatInstant(date, locale.value),
  },
  {
    selectClosing,
    selectTemplate,
    selectComparison,
    toggleThousands,
    writeHiddenWidgets,
    restorePublishedArbitration,
    restoreOffers,
  },
)

const isPublishPopupVisible = ref(false)

// Frozen while an encart is edited: re-entering would drop the words being written
const editionStore = useKeyMomentsEditionStore()
const reportKey = ref(reportRevision.value)

watch(reportRevision, (revision) => {
  if (editionStore.hasOpenEdition === false) {
    reportKey.value = revision
  }
})

const draftStore = useKeyMomentsDraftStore()

// A stale draft must not survive a change of closing or template made here
draftStore.clearDraft()

// A route of its own survives a reload; the draft is projected once, as publishing would freeze it
function openPreview(): void {
  const exerciceId = selectedExerciceId.value
  const exercice = exerciceCatalogue.value
    .find(summary => summary.exerciceId === exerciceId)
  const sources = snapshotSources()
  const context = publishContext.value

  if (
    exerciceId === undefined
    || exercice === undefined
    || sources === undefined
    || context === undefined
  ) {
    return
  }

  draftStore.setDraft({
    exerciceId,
    exerciceStartDate: exercice.exerciceStartDate,
    exerciceEndDate: exercice.exerciceEndDate,
    locale: locale.value,
    dataset: projectDraftDataset(sources.dataset, buildPublishedComments(screens.value)),
    template: sources.template,
    referenceKey: selectedReferenceKey.value,
    isInThousands: isInThousands.value,
    offers: customerOffersOf(linkedOffers.value),
    publicationState: publicationState.value,
    publishing: {
      context,
      snapshots: publishedSnapshots.value,
      buttonLabel: publishButtonLabel.value,
      popupMessage: publishPopupMessage.value,
      divergenceLabels: divergenceLabels.value,
      isDisabled: isPublishDisabled.value,
    },
  })

  router.push({
    name: RouteName.KEY_MOMENTS_PREVIEW,
    params: { ...route.params, exerciceId },
  })
}

function askPublish(): void {
  isPublishPopupVisible.value = true
}

async function onPublish(): Promise<void> {
  isPublishPopupVisible.value = false

  const context = publishContext.value

  if (context === undefined) {
    return
  }

  await publish(context, publishedSnapshots.value)
}
</script>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;
@use '../../styles/report';
@use '../../styles/screen';

.key-moments {

  &__exercice-select {
    width: 130px;
  }

  &__closing-select {
    width: 185px;
  }

  &__screen--hidden {
    opacity: 0.45;
  }

  // The header band already sets the first section apart
  &__screen:first-child {
    padding-top: 0;
  }

  @include breakpoints.media(xs) {

    // Wrapping is not enough: the title would shrink and clip the statements
    &__header {
      flex-direction: column;
      align-items: stretch;
    }

    &__entity-name {
      display: block;
    }

    &__published-state {
      align-items: flex-start;
      white-space: normal;
    }

    // The unshrinkable basis is what drops the import button under the selects
    &__deliveries {
      row-gap: 12px;
    }

    &__exercice-select,
    &__closing-select {
      flex: 1 1 140px;
      min-width: 140px;
      width: auto;
    }

  }

}

.key-moments-divergences__row:nth-child(odd) {
  background-color: var(--p-surface-neutral-lighter);
}
</style>
