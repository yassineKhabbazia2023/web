<template>
  <div
    class="key-moments-preview position--relative"
    :style="{ '--key-moments-sticky-offset': `${stickyOffset}px` }"
  >
    <!-- The banner is all the collaborator adds: below is the client page itself, not a mirror -->
    <div
      ref="banner"
      class="
        key-moments-preview__banner
        flex
        flex--wrap
        flex--align-items-center
        flex-gap--3
        padding--3
      "
    >
      <span
        class="key-moments-preview__tag no-wrap"
        data-testid="key-moments-preview-tag"
      >
        {{ t('keyMoments.preview.clientTag') }}
      </span>
      <span
        class="font-small"
        data-testid="key-moments-preview-caption"
      >
        {{ caption }}
      </span>

      <div
        class="
          flex
          flex--wrap
          flex--align-items-flex-end
          flex-gap--2
          margin-left--auto
        "
      >
        <!-- Options read from the client page, so it never offers an exercice that page cannot open -->
        <PDropdown
          v-if="exerciceOptions.length > 1"
          class="key-moments-preview__exercice-select"
          :modelValue="publishedPage?.selectedExerciceId"
          :pOptions="exerciceOptions"
          :pAriaLabel="t('keyMoments.exerciceSelect.ariaLabel')"
          pSize="small"
          pTestId="key-moments-preview-exercice-select"
          @update:model-value="value => publishedPage?.selectExercice(value as number)"
        />

        <FilterSegment
          v-if="isModeSegmentVisible"
          class="key-moments-preview__mode"
          :label="t('keyMoments.preview.mode.label')"
          :options="modeOptions"
          :selectedValue="mode ?? PreviewMode.PUBLISHED"
          testId="key-moments-preview-mode"
          @select="value => selectMode(value as PreviewMode)"
        />
        <!-- Export only on the published side: a deck drawn from a draft would circulate as if the client had it -->
        <PToolbox
          v-if="mode === PreviewMode.PUBLISHED && publishedPage?.hasReport === true"
          pTrigger="click"
          pPlacement="bottom-end"
          :pElements="exportItems"
          pElementsTestId="key-moments-export-menu"
          @p-toolbox-item-clicked="(format: ExportFormat) => publishedPage?.exportPublication(format)"
        >
          <PButton
            pSize="small"
            pType="primary"
            :pLoading="publishedPage?.isExportingDeck === true || publishedPage?.isExportingPdf === true"
            pTestId="key-moments-export-button"
          >
            {{ t('keyMoments.export.menu') }}
            <PIcon
              class="margin-left--1"
              pName="chevronDown"
            />
          </PButton>
        </PToolbox>
        <PButton
          pSize="small"
          pType="secondary"
          pTestId="key-moments-preview-back-button"
          @click="backToEditor"
        >
          {{ t('keyMoments.preview.back') }}
        </PButton>
        <PButton
          v-if="mode === PreviewMode.DRAFT && draft !== undefined"
          pSize="small"
          pType="primary"
          :pDisabled="draft.publishing.isDisabled"
          :pLoading="isPublishing"
          pTestId="key-moments-preview-publish-button"
          @click="isPublishPopupVisible = true"
        >
          {{ draft.publishing.buttonLabel }}
        </PButton>
        <PButton
          v-else-if="publication !== undefined"
          class="key-moments-preview__unpublish"
          pSize="small"
          pType="danger"
          :pLoading="isUnpublishing"
          pTestId="key-moments-unpublish-button"
          @click="isUnpublishPopupVisible = true"
        >
          {{ t('keyMoments.unpublish.button') }}
        </PButton>
      </div>
    </div>

    <CustomerKeyMoments
      v-if="mode === PreviewMode.PUBLISHED"
      ref="publishedPage"
      v-model:exerciceId="exerciceId"
      :isTracked="false"
      :hasExerciceSelect="false"
      :hasUnitSelect="false"
      @update:exercice-id="replaceExerciceInRoute"
    />

    <KeyMomentsReader
      v-else-if="mode === PreviewMode.DRAFT && draftReport !== undefined"
      :entityName="entityName"
      :caption="draftCaption"
      :screens="draftReport.screens"
      :recommendations="draft?.recommendations ?? []"
      isPreview
      :isInThousands="isInThousands"
      :hasReport="hasDraftContent"
      :hasUnitSelect="false"
    >
      <!-- Same neutral message as the client page, rather than a blank page -->
      <template
        v-if="hasDraftContent === false"
        #report
      >
        <PAlert
          class="margin-top--6"
          pType="info"
          data-testid="key-moments-preview-empty"
        >
          {{ t('keyMoments.customer.empty') }}
        </PAlert>
      </template>
    </KeyMomentsReader>

    <!-- Reload or direct link with nothing published: stated only once publications have answered -->
    <PAlert
      v-else-if="isLoadingPublications === false"
      class="margin--6"
      pType="info"
      data-testid="key-moments-preview-no-draft"
    >
      {{ t('keyMoments.preview.noDraft') }}
    </PAlert>

    <PublishPopup
      v-model:isVisible="isPublishPopupVisible"
      :message="draft?.publishing.popupMessage ?? ''"
      :recommendationsLine="draft?.publishing.recommendationsLine"
      :divergenceLabels="draft?.publishing.divergenceLabels ?? []"
      :confirmLabel="draft?.publishing.confirmLabel ?? t('keyMoments.publish.popup.confirm')"
      :isPublishing="isPublishing"
      :width="popupWidth"
      testIdPrefix="key-moments-preview-publish"
      @confirm="onPublish"
    />

    <UnpublishPopup
      v-model:isVisible="isUnpublishPopupVisible"
      :publication="publication"
      :width="popupWidth"
      testId="key-moments-unpublish-popup"
      @confirm="onUnpublish"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { RouteName, RouteParam } from '@pulse/common/enums'
import { RouterHelpers } from '@pulse/common/helpers'
import { useResponsive } from '@pulse/styleguide'
import {
  PAlert,
  PButton,
  PDropdown,
  PIcon,
  PToolbox,
} from '@pulse/styleguide/components'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import CustomerKeyMoments from '../customer/customer-key-moments.page.vue'
import KeyMomentsReader from '../customer/key-moments-reader.vue'
import FilterSegment from '../../components/filters/filter-segment.vue'
import PublishPopup from '../../components/publish-popup/publish-popup.vue'
import UnpublishPopup from '../../components/unpublish-popup/unpublish-popup.vue'
import { formatCalendarDay, formatInstant } from '../../utils/date.utils'
import { usePublications } from '../key-moments/publication.composable'
import { useComments } from '../key-moments/comments.composable'
import { useEntityName } from '../../composables/use-entity-name.composable'
import { useKeyMomentsDraftStore } from '../../stores/key-moments-draft.store'
import { useKeyMomentsPreview } from './key-moments-preview.composable'
import { PreviewMode } from './key-moments-preview.enums'
import { ExportFormat } from '../../enums/key-moments.enums'
import type { ReaderExerciceOption } from '../customer/key-moments-reader.types'
import type { FilterOption } from '../../types/key-moments.types'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const { isMobile } = useResponsive()
const { entityName } = useEntityName()

const entityId = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)

const publications = usePublications(entityId)
const {
  isLoading: isLoadingPublications,
  isUnpublishing,
  loadPublications,
  publicationOf,
  unpublish,
} = publications

const { isPublishing, publish } = useComments(entityId, publications)
const draftStore = useKeyMomentsDraftStore()

// Pinned over the report, so what the report pins of its own has to start under it
const banner = useTemplateRef<HTMLElement>('banner')
// border-box: the padding of the banner covers the report as much as its content does
const { height: bannerHeight } = useElementSize(banner, undefined, { box: 'border-box' })

// Not pinned on a phone, where its three rows would hold a third of the screen
const stickyOffset = computed(() => (isMobile.value ? 0 : bannerHeight.value))

// The default width is a share of the screen, too narrow on a phone
const popupWidth = computed(() => (isMobile.value ? 'calc(100vw - 24px)' : undefined))

// Carried by the URL; bound both ways since the client page settles which exercice it can show
const exerciceId = ref(
  RouterHelpers.getRouteParamAsInt(route, RouteParam.EXERCICE_ID) ?? undefined,
)

const isUnpublishPopupVisible = ref(false)
const isPublishPopupVisible = ref(false)

// Absent while the draft is on screen and until the page has mounted
const publishedPage = useTemplateRef<{
  exerciceOptions: ReaderExerciceOption[]
  selectedExerciceId: number | undefined
  selectExercice: (exerciceId: number) => void
  hasReport: boolean
  isExportingDeck: boolean
  isExportingPdf: boolean
  exportPublication: (format: ExportFormat) => void
}>('publishedPage')

const exportItems = computed<PToolboxItemProps<ExportFormat>[]>(() => [
  { pValue: t('keyMoments.export.button.pdf'), pIconName: 'filetypePdf', pActionName: ExportFormat.PDF },
  { pValue: t('keyMoments.export.button.pptx'), pIconName: 'filetypePpt', pActionName: ExportFormat.PPTX },
])

const exerciceOptions = computed(() => publishedPage.value?.exerciceOptions ?? [])

onMounted(() => {
  loadPublications()
})

// Replaced rather than pushed: switching exercice is not a step the back button should undo
function replaceExerciceInRoute(openedExerciceId: number | undefined): void {
  if (openedExerciceId === undefined) {
    return
  }

  router.replace({
    name: RouteName.KEY_MOMENTS_PREVIEW,
    params: { ...route.params, exerciceId: openedExerciceId },
  })
}

const publication = computed(() => (exerciceId.value === undefined
  ? undefined
  : publicationOf(exerciceId.value)))

const {
  draft,
  mode,
  selectMode,
  isModeSegmentVisible,
  isInThousands,
  draftReport,
} = useKeyMomentsPreview(exerciceId, publication)

const hasDraftContent = computed(() => (draftReport.value?.screens.length ?? 0) > 0
  || (draft.value?.recommendations.length ?? 0) > 0)

const modeOptions = computed<FilterOption[]>(() => [
  { value: PreviewMode.DRAFT, label: t('keyMoments.preview.mode.draft') },
  { value: PreviewMode.PUBLISHED, label: t('keyMoments.preview.mode.published') },
])

const caption = computed(() => {
  const current = publication.value

  if (mode.value === PreviewMode.DRAFT) {
    return current !== undefined && isModeSegmentVisible.value
      ? t('keyMoments.preview.captionDraftDivergent', {
        date: formatInstant(current.publishedAt, locale.value),
      })
      : t('keyMoments.preview.captionDraft')
  }

  return current === undefined
    ? t('keyMoments.preview.caption')
    : t('keyMoments.preview.captionPublished', {
      date: formatInstant(current.publishedAt, locale.value),
      author: current.publishedByName,
    })
})

const draftCaption = computed(() => {
  const current = draft.value

  return current === undefined ? [] : [t('keyMoments.customer.caption.exercice', {
    start: formatCalendarDay(current.exerciceStartDate, current.locale),
    end: formatCalendarDay(current.exerciceEndDate, current.locale),
  })]
})

// The editor saved the recommendations before handing the draft over: what is published is what is stored
async function onPublish(): Promise<void> {
  isPublishPopupVisible.value = false

  const current = draft.value

  if (current === undefined) {
    return
  }

  if (await publish(current.publishing.context, current.publishing.offers)) {
    draftStore.clearDraft()
  }
}

function backToEditor(): void {
  // The editor route only declares the entity: the exercice param of the preview must not leak into it
  router.push({ name: RouteName.KEY_MOMENTS, params: { [RouteParam.ENTITY_ID]: route.params[RouteParam.ENTITY_ID] } })
}

async function onUnpublish(): Promise<void> {
  isUnpublishPopupVisible.value = false

  const current = publication.value

  if (current === undefined) {
    return
  }

  if (await unpublish(current.id)) {
    backToEditor()
  }
}
</script>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

// Own stacking context below the navigation, so the banner z-index is not read against the sidebar's
.key-moments-preview {
  z-index: 1;

  // The skewed cartouche of the brand, saying whose eyes the page below is seen through
  &__tag {
    padding: 4px 12px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--p-white);
    background-color: var(--p-jungle-400);
    clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
  }

  // Read on the dark banner
  &__mode {
    --p-text-basic-heading: var(--p-white);
  }

  // A select owes nothing to its content width: unsized, it shrinks to its arrow
  &__exercice-select {
    width: 220px;
  }

  &__banner {
    position: sticky;
    top: 0;
    z-index: 20;
    color: var(--p-white);
    background-color: var(--p-black-rock-900);
    border-bottom: 1px solid rgba(var(--p-white-rgb), 0.12);
  }

  // Filled red rather than the outlined `danger`, which reads quieter than the button beside it
  &__banner &__unpublish {
    --el-button-text-color: var(--p-white);
    --el-button-bg-color: var(--p-button-danger-text-default);
    --el-button-border-color: var(--p-button-danger-text-default);
    --el-button-hover-text-color: var(--p-white);
    --el-button-hover-bg-color: var(--p-button-danger-text-hover);
    --el-button-hover-border-color: var(--p-button-danger-text-hover);
    --el-button-active-text-color: var(--p-white);
    --el-button-active-bg-color: var(--p-button-danger-text-press);
    --el-button-active-border-color: var(--p-button-danger-text-press);

    // Element Plus exposes no variable for the press state
    &:focus:not(.is-disabled),
    &.p-button--is-active:not(.is-disabled) {
      color: var(--p-white);
      background: var(--p-button-danger-text-press);
      border-color: var(--p-button-danger-text-press);
    }
  }

  @include breakpoints.media(xs) {
    &__banner {
      position: static;
    }

    &__exercice-select {
      width: 100%;
    }
  }
}
</style>
