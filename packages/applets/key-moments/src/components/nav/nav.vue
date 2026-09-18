<template>
  <nav
    class="key-moments-nav"
    :class="{ 'key-moments-nav--collapsed': isCollapsed }"
    :aria-label="t('keyMoments.nav.title')"
    data-testid="key-moments-nav"
  >
    <div
      class="
        key-moments-nav__head
        flex
        flex--align-items-center
        flex--justify-content-space-between
        flex-gap--2
        margin-bottom--4
      "
    >
      <!-- Kept mounted while folded, so the toggle slides instead of jumping -->
      <h2
        class="
          key-moments-nav__title
          margin--0
          overflow-hidden
          font-size--11
          font-bold
          text-uppercase
          no-wrap
        "
        :aria-hidden="isCollapsed"
      >
        {{ t('keyMoments.nav.title') }}
      </h2>

      <PButton
        pSize="small"
        pIconOnly
        pType="tertiary"
        :aria-expanded="isCollapsed === false"
        :aria-label="isCollapsed
          ? t('keyMoments.nav.expand')
          : t('keyMoments.nav.collapse')"
        pTestId="key-moments-nav-toggle-button"
        @click="isCollapsed = isCollapsed === false"
      >
        <PIcon
          class="key-moments-nav__toggle-icon"
          :class="{ 'key-moments-nav__toggle-icon--flipped': isCollapsed }"
          pName="chevronDoubleLeft"
        />
      </PButton>
    </div>

    <!-- Clipped rather than unmounted so the fold animates; `inert` takes it out of reach -->
    <div
      class="key-moments-nav__body"
      :inert="isCollapsed"
    >
      <!-- One section unfolded at a time, so the whole navigation fits a screen -->
      <div
        ref="screensListElement"
        class="key-moments-nav__screens"
        data-list-id="screens"
      >
        <div
          v-for="screen in screens"
          :key="screen.id"
          class="key-moments-nav__group"
          :data-item-id="screen.id"
          @mouseenter="alwaysExpanded === false && scheduleUnfold(screen.id)"
          @mouseleave="cancelScheduledUnfold"
        >
          <div
            class="
              key-moments-nav__screen-row
              flex
              flex--align-items-center
              flex-gap--1
            "
          >
            <button
              type="button"
              class="
                key-moments-nav__screen
                flex
                flex--align-items-center
                flex--justify-content-space-between
                flex-gap--2
                width--100
                padding--2
                font-size--14
                font-bold
                text-left
                cursor-pointer
              "
              :class="{
                'key-moments-nav__screen--open': isExpanded(screen.id),
                'key-moments-nav__screen--hidden': isScreenFullyHidden(screen),
              }"
              :aria-expanded="isExpanded(screen.id)"
              :data-testid="`key-moments-nav-screen-${screen.id}`"
              @click="onScreenClick(screen.id)"
              @focus="alwaysExpanded === false && unfold(screen.id)"
            >
              <span class="key-moments-nav__screen-label">{{ screen.title }}</span>
              <!-- The badge replaces the counter, so a fully hidden section reads as hidden without unfolding it -->
              <span
                v-if="isScreenFullyHidden(screen)"
                class="
                  key-moments-nav__screen-state
                  font-size--11
                  font-normal
                "
              >
                {{ t('keyMoments.visibility.hiddenBadge') }}
              </span>
              <span
                v-else
                class="
                  key-moments-nav__count
                  font-size--12
                  font-normal
                "
              >
                {{ countVisibleWidgets(screen) }}
              </span>
            </button>

            <!-- Beside the entry: a button never nests in another one -->
            <slot
              name="screen-tools"
              :screen="screen"
            />
          </div>

          <!-- Two nested elements: the outer animates its row from 0fr to 1fr, the inner clips -->
          <div
            class="key-moments-nav__widgets grid"
            :class="{ 'key-moments-nav__widgets--open': isExpanded(screen.id) }"
            :inert="isExpanded(screen.id) === false"
          >
            <div
              :ref="element => emit('register-widgets-list', screen.id, element as HTMLElement | null)"
              class="overflow-hidden"
              :data-list-id="screen.id"
            >
              <div
                v-for="widget in screen.widgets"
                :key="widget.id"
                class="
                  key-moments-nav__widget-row
                  flex
                  flex--align-items-center
                  flex-gap--1
                "
                :data-item-id="widget.id"
              >
                <!-- Beside the entry: a button never nests in another one -->
                <slot
                  name="widget-tools"
                  :widget="widget"
                  :screen="screen"
                />

                <button
                  type="button"
                  class="
                    key-moments-nav__widget
                    flex
                    flex--align-items-center
                    flex-gap--2
                    width--100
                    padding--2
                    font-size--13
                    text-left
                    cursor-pointer
                  "
                  :class="{
                    'key-moments-nav__widget--active': activeAnchorId === widgetAnchorId(widget.id),
                    'key-moments-nav__widget--hidden': widget.isHidden,
                  }"
                  :aria-current="activeAnchorId === widgetAnchorId(widget.id)"
                  :data-testid="`key-moments-nav-widget-${widget.id}`"
                  @click="goTo(widgetAnchorId(widget.id))"
                >
                  <span class="key-moments-nav__widget-label">{{ widget.title }}</span>
                  <span
                    v-if="widget.isHidden"
                    class="key-moments-nav__widget-state font-size--11"
                  >
                    {{ t('keyMoments.visibility.hiddenBadge') }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <slot name="after-screens" />

      <!-- Driven by a flag, not pushed into `screens`: the offers section is not part of the template -->
      <div
        v-if="hasOffers"
        class="key-moments-nav__group"
      >
        <button
          type="button"
          class="
            key-moments-nav__screen
            flex
            flex--align-items-center
            flex--justify-content-space-between
            flex-gap--2
            width--100
            padding--2
            font-size--14
            font-bold
            text-left
            cursor-pointer
          "
          :class="{ 'key-moments-nav__screen--open': activeAnchorId === OFFERS_ANCHOR_ID }"
          data-testid="key-moments-nav-screen-offers"
          @click="goTo(OFFERS_ANCHOR_ID)"
        >
          <span>{{ t('keyMoments.offers.title') }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PIcon } from '@pulse/styleguide/components'
import { OFFERS_ANCHOR_ID, screenAnchorId, widgetAnchorId } from '../../utils/anchor.utils'
import { useAnchorScroll, useScrollSpy } from './nav.composable'
import type { Screen } from '../../types/key-moments.types'

const props = withDefaults(defineProps<{
  screens: Screen[]
  hasOffers: boolean
  /** Every section unfolded: the editor cannot drag into a list folding under the cursor */
  alwaysExpanded?: boolean
}>(), {
  alwaysExpanded: false,
})

const emit = defineEmits<{
  'register-widgets-list': [screenId: string, element: HTMLElement | null]
}>()

const { t } = useI18n()

// Exposed so the editor can make the sections sortable
const screensListElement = useTemplateRef<HTMLElement>('screensListElement')

defineExpose({ screensListElement })

// Not persisted, like the filters
const isCollapsed = ref(false)

const anchorIds = computed(() => [
  ...props.screens.flatMap(screen => [
    screenAnchorId(screen.id),
    ...screen.widgets.map(widget => widgetAnchorId(widget.id)),
  ]),
  ...(props.hasOffers ? [OFFERS_ANCHOR_ID] : []),
])

const { activeAnchorId } = useScrollSpy(() => anchorIds.value)

const { scrollToAnchor: goTo } = useAnchorScroll()

const openScreenId = ref<string>()

// Scrolling unfolds the section it enters, so the highlighted block is never folded away
watch(activeAnchorId, (anchorId) => {
  if (props.alwaysExpanded) {
    return
  }

  const reachedScreen = props.screens.find(screen =>
    screenAnchorId(screen.id) === anchorId
    || screen.widgets.some(widget => widgetAnchorId(widget.id) === anchorId))

  if (reachedScreen !== undefined) {
    openScreenId.value = reachedScreen.id
  }
})

// Falls back to the first section when the open one no longer exists (template switch)
const unfoldedScreenId = computed(() => {
  const isStillDisplayed = props.screens
    .some(screen => screen.id === openScreenId.value)

  return isStillDisplayed ? openScreenId.value : props.screens[0]?.id
})

function isExpanded(screenId: string): boolean {
  return props.alwaysExpanded || screenId === unfoldedScreenId.value
}

function onScreenClick(screenId: string): void {
  unfold(screenId)
  goTo(screenAnchorId(screenId))
}

// Keeps a cursor merely crossing the list from unfolding every section it passes over
const UNFOLD_HOVER_DELAY_MS = 300

let unfoldTimeout: ReturnType<typeof setTimeout> | undefined

function unfold(screenId: string): void {
  cancelScheduledUnfold()
  openScreenId.value = screenId
}

function scheduleUnfold(screenId: string): void {
  cancelScheduledUnfold()
  unfoldTimeout = setTimeout(() => unfold(screenId), UNFOLD_HOVER_DELAY_MS)
}

function cancelScheduledUnfold(): void {
  clearTimeout(unfoldTimeout)
  unfoldTimeout = undefined
}

onBeforeUnmount(cancelScheduledUnfold)

function countVisibleWidgets(screen: Screen): number {
  return screen.widgets.filter(widget => widget.isHidden === false).length
}

// An empty section hides nothing, so it is not considered hidden
function isScreenFullyHidden(screen: Screen): boolean {
  return screen.widgets.length > 0 && countVisibleWidgets(screen) === 0
}
</script>

<style scoped lang="scss">
// The custom property lets the template editor widen the column for its entry tools
$nav-width: 264px;
$nav-gutter: 16px;
$nav-collapsed-width: 40px;

.key-moments-nav {
  position: sticky;
  // under whatever the embedding page pins above the report — the preview banner
  top: calc(16px + var(--key-moments-sticky-offset, 0px));
  flex: 0 0 var(--key-moments-nav-width, #{$nav-width});
  // bounded by the layout main container, not the viewport, or its scrollbar runs off screen
  max-height: calc(100vh - var(--p-header-height, 0px) - 32px);
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: $nav-gutter;
  border-right: 1px solid var(--key-moments-line);
  transition: flex-basis 0.25s ease, padding-right 0.25s ease, border-right-color 0.25s ease;

  // A width rather than `auto`, which no browser interpolates
  &--collapsed {
    flex-basis: $nav-collapsed-width;
    padding-right: 0;
    border-right-color: transparent;
    overflow-y: hidden;
  }

  &__head {
    min-height: 32px;
  }

  // Kept at the open width so the list slides behind the column edge instead of reflowing
  &__body {
    width: calc(var(--key-moments-nav-width, #{$nav-width}) - #{$nav-gutter});
    opacity: 1;
    transition: opacity 0.2s ease;
  }

  &--collapsed &__body {
    opacity: 0;
  }

  &__toggle-icon {
    transition: transform 0.2s;

    &--flipped {
      transform: rotate(180deg);
    }
  }

  &__title {
    flex: 1;
    min-width: 0;
    letter-spacing: 0.08em;
    color: var(--p-text-neutral);
    opacity: 1;
    transition: opacity 0.2s ease;
  }

  &--collapsed &__title {
    opacity: 0;
  }

  &__group ~ &__group,
  &__screens + &__group {
    margin-top: 20px;
  }

  &__screen-row &__screen,
  &__widget-row &__widget {
    flex: 1;
    min-width: 0;
  }

  &__screen {
    color: var(--p-text-heading);
    background-color: var(--key-moments-emphasis-surface);
    border: none;
    border-left: 3px solid transparent;

    &--open {
      border-left-color: var(--p-jungle-400);
    }

    &--hidden .key-moments-nav__screen-label {
      font-style: italic;
      font-weight: 400;
      color: var(--p-text-neutral);
    }
  }

  &__screen-label {
    flex: 1;
  }

  &__screen-state,
  &__count {
    color: var(--p-text-neutral);
  }

  // `grid-template-rows` interpolates where `height: auto` does not
  &__widgets {
    grid-template-rows: 0fr;
    opacity: 0;
    transition: grid-template-rows 0.25s ease, opacity 0.2s ease;

    &--open {
      grid-template-rows: 1fr;
      opacity: 1;
    }
  }

  &__widget {
    color: var(--p-text-body);
    background: none;
    border: none;
    border-bottom: 1px solid var(--key-moments-line);
    border-left: 3px solid transparent;

    &:hover {
      background-color: var(--key-moments-stripe-surface);
    }

    &--active {
      font-weight: 700;
      background-color: var(--key-moments-emphasis-surface);
      border-left-color: var(--p-mint-tulip-500);
    }

    &--hidden .key-moments-nav__widget-label {
      font-style: italic;
      color: var(--p-text-neutral);
    }
  }

  &__widget-label {
    flex: 1;
  }

  &__widget-state {
    color: var(--p-text-neutral);
  }
}

@media (prefers-reduced-motion: reduce) {
  .key-moments-nav,
  .key-moments-nav__body,
  .key-moments-nav__title,
  .key-moments-nav__widgets,
  .key-moments-nav__toggle-icon {
    transition: none;
  }
}

@media (width <= 1050px) {
  .key-moments-nav {
    position: static;
    flex-basis: auto;
    max-height: none;
    padding-right: 0;
    padding-bottom: 16px;
    border-right: none;
    border-bottom: 1px solid var(--key-moments-line);
  }

  .key-moments-nav__body {
    width: 100%;
  }
}
</style>
