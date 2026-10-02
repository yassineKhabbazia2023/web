<template>
  <div
    class="
      key-moments
      flex
      flex--direction-column
    "
    :style="{ '--key-moments-sticky-offset': `${stickyOffset}px` }"
  >
    <section class="key-moments__content">
      <PTitle>
        <i18n-t
          v-if="entityName !== undefined"
          keypath="keyMoments.titleOf"
          scope="global"
          tag="span"
        >
          <template #name>
            <span class="key-moments__entity-name text-color--jungle-400">
              {{ entityName }}
            </span>
          </template>
        </i18n-t>
        <template v-else>
          {{ t('keyMoments.title') }}
        </template>
      </PTitle>

      <div
        class="
          key-moments__header
          flex
          flex--wrap
          flex--align-items-flex-start
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
        </div>
      </div>

      <ReportToolbar
        ref="toolbar"
        class="margin-top--4"
      >
        <Filters
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

        <template #actions>
          <!-- Beside the publication buttons, since it lists what publishing would send -->
          <ModificationsPanel
            :modifications="modifications"
            @restore="isRestorePopupVisible = true"
          />
          <PButton
            v-if="publication !== undefined"
            pSize="small"
            pType="danger"
            :pLoading="isUnpublishing"
            pTestId="key-moments-editor-unpublish-button"
            @click="isUnpublishPopupVisible = true"
          >
            {{ t('keyMoments.unpublish.button') }}
          </PButton>
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
        </template>
      </ReportToolbar>

      <!--
        Signalled to the firm alone, and never repaired here: the name displayed stays the dossier's.
        Only beside the closing it describes: a failed switch keeps the previous one in memory.
      -->
      <PAlert
        v-if="mismatchedClosingName !== undefined && isLoading === false && hasError === false"
        class="margin-top--4"
        pType="warning"
        data-testid="key-moments-entity-name-mismatch"
      >
        {{ t('keyMoments.entityNameMismatch', { closingName: mismatchedClosingName, entityName }) }}
      </PAlert>

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
          :hasRecommendations="canSeeRecommendations"
          :recommendationRubrics="navRubrics"
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
                  @delete-comment="askDeleteComment"
                  @toggle-visibility="toggleWidgetVisibility(widget.id)"
                />
              </div>
            </section>

            <!-- Not offered over an unreadable draft: nothing must be written over what could not be read -->
            <RecommendationsSection
              v-if="canSeeRecommendations && isDraftUnreadable === false"
              :rank="formatScreenRank(screens.length)"
              :categories="recommendationCategories"
              :categoryLabel="categoryLabel"
              :rubricViews="rubricViews"
              :isSaving="isSavingRecommendations"
              :hasSaveFailed="hasRecommendationsSaveFailed"
              :areThemesUnreadable="areRecommendationThemesUnreadable"
              :hasCategory="hasCategory"
              :totalCount="totalCount"
              :visibleCount="visibleRecommendationCount"
              :canAdd="canAddRecommendation"
              :catalog="recommendationsCatalog"
              :style="{ '--key-moments-enter-rank': screens.length }"
              @choose="chooseCategory"
              @add="(rubric, settle) => settle(addRecommendation(rubric))"
              @move="moveRecommendation"
              @update="updateRecommendation"
              @remove="removeRecommendation"
            />
          </div>
        </div>
      </div>
    </section>

    <PublishPopup
      v-model:isVisible="isPublishPopupVisible"
      :message="publishPopupMessage"
      :recommendationsLine="publishPopupRecommendationsLine"
      :divergenceLabels="divergenceLabels"
      :confirmLabel="publishPopupConfirmLabel"
      :isPublishing="isPublishing"
      :width="popupWidth"
      testIdPrefix="key-moments-publish"
      @confirm="onPublish"
    />

    <PConfirmationPopup
      v-model:pIsVisible="isRestorePopupVisible"
      pAppendToBody
      :pTitle="t('keyMoments.publish.restore.popup.title')"
      :pConfirmButtonContent="t('keyMoments.publish.restore.popup.confirm')"
      :pCancelButtonContent="t('keyMoments.publish.restore.popup.cancel')"
      :pConfirmButtonIsLoading="isRestoring"
      :pWidth="popupWidth"
      pTestId="key-moments-restore-published-popup"
      @on-confirm-button-click="onRestorePublished"
      @on-cancel-button-click="isRestorePopupVisible = false"
    >
      <p>{{ t('keyMoments.publish.restore.popup.message') }}</p>
    </PConfirmationPopup>

    <UnpublishPopup
      v-model:isVisible="isUnpublishPopupVisible"
      :publication="publication"
      :width="popupWidth"
      testId="key-moments-editor-unpublish-popup"
      @confirm="onUnpublish"
    />

    <!-- At the root with the other dialogs: inside a widget, its containment would clip the overlay -->
    <PConfirmationPopup
      v-model:pIsVisible="isDeleteCommentPopupVisible"
      pAppendToBody
      :pTitle="t('keyMoments.comment.deletePopup.title')"
      :pConfirmButtonContent="t('keyMoments.comment.deletePopup.confirm')"
      :pCancelButtonContent="t('keyMoments.comment.deletePopup.cancel')"
      :pConfirmButtonIsLoading="isDeletingComment"
      :pWidth="popupWidth"
      pTestId="key-moments-delete-comment-popup"
      @on-confirm-button-click="onDeleteComment"
      @on-cancel-button-click="isDeleteCommentPopupVisible = false"
    >
      <i18n-t
        keypath="keyMoments.comment.deletePopup.message"
        scope="global"
        tag="p"
      >
        <template #comment>
          <em class="key-moments-delete-comment__text">{{ deletingComment?.text }}</em>
        </template>
      </i18n-t>
      <!-- The API may discard the slot along with the reading the client reads -->
      <p
        v-if="deletingComment?.isDisplayed === true"
        class="font-bold"
        data-testid="key-moments-delete-comment-displayed-warning"
      >
        {{ t('keyMoments.comment.deletePopup.displayedWarning') }}
      </p>
    </PConfirmationPopup>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
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
import PublishPopup from '../../components/publish-popup/publish-popup.vue'
import ModificationsPanel from '../../components/modifications-panel/modifications-panel.vue'
import Nav from '../../components/nav/nav.vue'
import RecommendationsSection from '../../components/recommendations/recommendations-section.vue'
import ReportToolbar from '../../components/report-toolbar/report-toolbar.vue'
import SectionHead from '../../components/section-head/section-head.vue'
import UnpublishPopup from '../../components/unpublish-popup/unpublish-popup.vue'
import Widget from '../../components/widget/widget.vue'
import { screenAnchorId, widgetAnchorId } from '../../utils/anchor.utils'
import { formatInstant } from '../../utils/date.utils'
import { formatScreenRank } from '../../utils/rank.utils'
import { useKeyMoments } from './key-moments.composable'
import { useRecommendations } from './recommendations.composable'
import { useComments } from './comments.composable'
import { usePublications } from './publication.composable'
import { usePublishState } from './publish-state.composable'
import { useKeyMomentsDraftStore } from '../../stores/key-moments-draft.store'
import { projectDraftDataset } from '../../utils/draft.utils'
import { countVisible } from '../../utils/recommendations.utils'
import { useKeyMomentsEditionStore } from '../../stores/key-moments-edition.store'
import type { NavRubric } from '../../components/nav/nav.types'
import type { SaveSettlement, Screen } from '../../types/key-moments.types'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const { isMobile } = useResponsive()

const importInput = useTemplateRef<HTMLInputElement>('importInput')

// Pinned over the report, so what the report pins of its own has to start under it
const toolbar = useTemplateRef('toolbar')
// border-box: the padding of the bar covers the report as much as its content does
const { height: toolbarHeight } = useElementSize(toolbar, undefined, { box: 'border-box' })

const entityId = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)

const publications = usePublications(entityId)
const {
  publicationDetail,
  isUnpublishing,
  isRestoring,
  publicationOf,
  resolvePublishedPreferences,
  openExercice: readPublishedExercice,
  unpublish,
  restorePublished,
} = publications

const {
  isPublishing,
  loadComments,
  saveComment,
  retainVariant,
  discardSlot,
  buildCommentBoards,
  buildPublishedComments,
  publish,
} = useComments(entityId, publications)

const {
  isLoading,
  isImporting,
  hasError,
  hasNoClosing,
  entityName,
  mismatchedClosingName,
  screens,
  reportRevision,
  templateCatalogue,
  isInThousands,
  selectedReferenceKey,
  locale,
  templateModelOptions,
  selectedModelCode,
  exerciceOptions,
  exerciceCatalogue,
  closingOptions,
  comparisonOptions,
  hiddenWidgetIds,
  snapshotSources,
  toggleThousands,
  toggleWidgetVisibility,
  selectComparison,
  selectedTemplateId,
  selectedExerciceId,
  closingCatalogue,
  selectedClosingId,
  selectModel,
  selectExercice,
  selectClosing,
  importClosing,
  draftRecommendations,
  isDraftUnreadable,
} = useKeyMoments(entityId, resolvePublishedPreferences)

const {
  categories: recommendationCategories,
  categoryLabel,
  rubricViews,
  catalog: recommendationsCatalog,
  isSaving: isSavingRecommendations,
  hasSaveFailed: hasRecommendationsSaveFailed,
  areThemesUnreadable: areRecommendationThemesUnreadable,
  hasCategory,
  canSeeRecommendations,
  publishableRecommendations,
  publishedOffers,
  unresolvedOfferIds,
  visibleCount: visibleRecommendationCount,
  withoutThemeCount: recommendationWithoutThemeCount,
  totalCount,
  canAdd: canAddRecommendation,
  chooseCategory,
  addRecommendation,
  updateRecommendation,
  removeRecommendation,
  moveRecommendation,
  flushSave: flushRecommendationsSave,
  discardPendingSave: discardPendingRecommendationsSave,
  resumeDiscardedSave: resumeDiscardedRecommendationsSave,
} = useRecommendations({ entityId, exerciceId: selectedExerciceId, draft: draftRecommendations })

const navRubrics = computed<NavRubric[] | undefined>(() => (hasCategory.value
  ? rubricViews.value.map(({ rubric, views }) => ({
    rubric,
    visibleCount: countVisible(views),
    totalCount: views.length,
  }))
  : undefined))

// Watched: selecting, the initial load and an import all change the exercice
watch(selectedExerciceId, (exerciceId) => {
  if (exerciceId === undefined) {
    return
  }

  readPublishedExercice(exerciceId)
}, { immediate: true })

// Which readings would be published depends on the closing, even an undefined one
watch(selectedClosingId, (closingId) => {
  const exerciceId = selectedExerciceId.value

  if (exerciceId === undefined) {
    return
  }

  loadComments(exerciceId, closingId)
}, { immediate: true })

async function onSaveComment(slotId: string, text: string, settle: SaveSettlement): Promise<void> {
  settle(await saveComment(slotId, text))
}

const isDeleteCommentPopupVisible = ref(false)
const isDeletingComment = ref(false)
// Kept once the dialog closes, so that its text does not blank out while it fades
const deletingComment = ref<{ slotId: string, text: string, isDisplayed: boolean }>()

function askDeleteComment(slotId: string, text: string, isDisplayed: boolean): void {
  deletingComment.value = { slotId, text, isDisplayed }
  isDeleteCommentPopupVisible.value = true
}

// The API has no deletion of its own: an emptied reading is one it no longer holds
async function onDeleteComment(): Promise<void> {
  const comment = deletingComment.value

  if (comment === undefined) {
    return
  }

  isDeletingComment.value = true
  const isDeleted = await saveComment(comment.slotId, '')
  isDeletingComment.value = false

  // A failed deletion keeps the dialog open, on the comment that is still there
  if (isDeleted) {
    isDeleteCommentPopupVisible.value = false
  }
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

// The bar is not pinned on a phone, so nothing has to start under it there
const stickyOffset = computed(() => (isMobile.value ? 0 : toolbarHeight.value))

const {
  currentPublication: publication,
  publishContext,
  divergenceLabels,
  modifications,
  publicationState,
  publishedStateLines,
  isPublishDisabled,
  publishBlockedReason,
  publishButtonLabel,
  publishPopupMessage,
  publishPopupRecommendationsLine,
  publishPopupConfirmLabel,
} = usePublishState({
  templateCatalogue,
  closingCatalogue,
  screens,
  hiddenWidgetIds,
  publishableRecommendations,
  hasRecommendationsSection: canSeeRecommendations,
  hasRecommendationsCategory: hasCategory,
  visibleRecommendationCount,
  unresolvedOfferIds,
  recommendationWithoutThemeCount,
  areRecommendationThemesUnreadable,
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
})

const isPublishPopupVisible = ref(false)
const isUnpublishPopupVisible = ref(false)
const isRestorePopupVisible = ref(false)

// The detail is read again so that the page stops comparing against a withdrawn publication
async function onUnpublish(): Promise<void> {
  isUnpublishPopupVisible.value = false

  const current = publication.value

  if (current === undefined) {
    return
  }

  if (await unpublish(current.id)) {
    await readPublishedExercice(current.exerciceId)
  }
}

/**
 * The microservice puts the whole draft back at once. What the pause still
 * holds of the recommendations is given up first, or it would be written over
 * what comes back. The closing on display is not part of the draft: the
 * published one is opened again, since a reading nobody retained publishes
 * the text of the closing it is read on.
 */
async function onRestorePublished(): Promise<void> {
  const exerciceId = selectedExerciceId.value
  const current = publication.value

  if (exerciceId === undefined || current === undefined) {
    return
  }

  await discardPendingRecommendationsSave()

  if (await restorePublished(exerciceId) === true) {
    const previousClosingId = selectedClosingId.value

    await selectExercice(exerciceId, current.closingId)

    // A closing that changed is read again by its watcher
    if (selectedClosingId.value === previousClosingId) {
      await loadComments(exerciceId, selectedClosingId.value)
    }
  } else {
    // Nothing was put back: the recommendations on screen are still the ones to save
    resumeDiscardedRecommendationsSave()
  }

  isRestorePopupVisible.value = false
}

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
async function openPreview(): Promise<void> {
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

  // The preview publishes what is saved: whatever the pause still holds goes first,
  // and a failed write keeps the editor, lest the preview show what would not be published
  if (await flushRecommendationsSave() === false) {
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
    recommendations: publishableRecommendations.value,
    isInThousands: isInThousands.value,
    publicationState: publicationState.value,
    publishing: {
      context,
      offers: publishedOffers.value,
      buttonLabel: publishButtonLabel.value,
      popupMessage: publishPopupMessage.value,
      recommendationsLine: publishPopupRecommendationsLine.value,
      confirmLabel: publishPopupConfirmLabel.value,
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

// Only the saved state is published: whatever the pause still holds goes first, and a refusal stops there
async function onPublish(): Promise<void> {
  isPublishPopupVisible.value = false

  const context = publishContext.value

  if (context === undefined) {
    return
  }

  if (await flushRecommendationsSave() === true) {
    await publish(context, publishedOffers.value)
  }
}
</script>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;
@use '../../styles/report';
@use '../../styles/screen';

// Own stacking context below the navigation, so the sticky bar z-index is not read against the sidebar's
.key-moments {
  position: relative;
  z-index: 1;

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

    // Stacked rather than wrapped: the published state lines up under the selects
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

// On a line of its own between the two halves of the sentence, as it was written
.key-moments-delete-comment__text {
  display: block;
  margin: 16px 0;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}
</style>
