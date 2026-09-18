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

    <!-- Export only on the published side: a deck drawn from a draft would circulate as if the client had it -->
    <CustomerKeyMoments
      v-if="mode === PreviewMode.PUBLISHED"
      ref="publishedPage"
      v-model:exerciceId="exerciceId"
      :isTracked="false"
      canExport
      :hasExerciceSelect="false"
      :hasUnitSelect="false"
      @update:exercice-id="replaceExerciceInRoute"
    />

    <KeyMomentsReader
      v-else-if="mode === PreviewMode.DRAFT && draftReport !== undefined"
      :entity="draftReport.entity"
      :caption="draftCaption"
      :screens="draftReport.screens"
      :offers="draft?.offers ?? []"
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

    <PConfirmationPopup
      v-model:pIsVisible="isPublishPopupVisible"
      :pTitle="t('keyMoments.publish.popup.title')"
      :pConfirmButtonContent="t('keyMoments.publish.popup.confirm')"
      :pCancelButtonContent="t('keyMoments.publish.popup.cancel')"
      :pConfirmButtonIsLoading="isPublishing"
      :pWidth="popupWidth"
      pTestId="key-moments-preview-publish-popup"
      @on-confirm-button-click="onPublish"
      @on-cancel-button-click="isPublishPopupVisible = false"
    >
      <p>{{ draft?.publishing.popupMessage }}</p>
      <ul
        v-if="draft !== undefined && draft.publishing.divergenceLabels.length > 0"
        class="
          list-style-none
          margin-top--3
          overflow-hidden
        "
        data-testid="key-moments-preview-publish-divergences"
      >
        <li
          v-for="label in draft.publishing.divergenceLabels"
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

    <PConfirmationPopup
      v-model:pIsVisible="isUnpublishPopupVisible"
      :pTitle="t('keyMoments.unpublish.popup.title')"
      :pConfirmButtonContent="t('keyMoments.unpublish.popup.confirm')"
      :pCancelButtonContent="t('keyMoments.unpublish.popup.cancel')"
      :pWidth="popupWidth"
      pTestId="key-moments-unpublish-popup"
      @on-confirm-button-click="onUnpublish"
      @on-cancel-button-click="isUnpublishPopupVisible = false"
    >
      {{ unpublishPopupMessage }}
    </PConfirmationPopup>
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
import { PAlert, PButton, PConfirmationPopup, PDropdown } from '@pulse/styleguide/components'
import CustomerKeyMoments from '../customer/customer-key-moments.page.vue'
import KeyMomentsReader from '../customer/key-moments-reader.vue'
import FilterSegment from '../../components/filters/filter-segment.vue'
import { formatCalendarDay, formatInstant } from '../../utils/date.utils'
import { usePublications } from '../key-moments/publication.composable'
import { useComments } from '../key-moments/comments.composable'
import { useKeyMomentsDraftStore } from '../../stores/key-moments-draft.store'
import { useKeyMomentsPreview } from './key-moments-preview.composable'
import { PreviewMode } from './key-moments-preview.enums'
import type { ReaderExerciceOption } from '../customer/key-moments-reader.types'
import type { FilterOption } from '../../types/key-moments.types'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const { isMobile } = useResponsive()

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
}>('publishedPage')

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
  || (draft.value?.offers.length ?? 0) > 0)

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

const unpublishPopupMessage = computed(() => {
  const current = publication.value

  return current === undefined ? '' : t('keyMoments.unpublish.popup.message', {
    date: formatInstant(current.publishedAt, locale.value),
    author: current.publishedByName,
  })
})

async function onPublish(): Promise<void> {
  isPublishPopupVisible.value = false

  const current = draft.value

  if (current === undefined) {
    return
  }

  if (await publish(current.publishing.context, current.publishing.snapshots)) {
    draftStore.clearDraft()
  }
}

function backToEditor(): void {
  router.push({ name: RouteName.KEY_MOMENTS, params: { ...route.params } })
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

  // Read on the dark banner
  &__mode {
    --p-text-heading: var(--p-white);
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

.key-moments-divergences__row:nth-child(odd) {
  background-color: var(--p-surface-neutral-lighter);
}
</style>
