<template>
  <article
    class="
      key-moments-widget
      flex
      flex--direction-column
      min-width--0
      position--relative
    "
    :class="{ 'key-moments-widget--hidden': widget.isHidden }"
    :data-testid="`key-moments-${widget.id}-widget`"
  >
    <header
      class="
        key-moments-widget__head
        flex
        flex--align-items-center
        flex--justify-content-space-between
        flex-gap--4
      "
    >
      <h3
        class="
          key-moments-widget__title
          margin--0
          font-bold
          text-color--text-heading
        "
      >
        {{ widget.title }}
        <!-- Where no switch states it: the template editor, whose tools stand in for it -->
        <span
          v-if="hasHiddenBadge && widget.isHidden"
          class="key-moments-widget__badge margin-left--2"
          :data-testid="`key-moments-${widget.id}-hidden-badge`"
        >
          {{ t('keyMoments.visibility.hiddenBadge') }}
        </span>
      </h3>

      <!-- The editor hangs its own tools here, in place of the switch -->
      <slot name="toolbar">
        <div
          v-if="isReadOnly === false"
          class="
            flex
            flex--align-items-center
            flex--shrink-0
            flex-gap--2
          "
        >
          <label
            class="key-moments-widget__visibility-label no-wrap"
            :class="{ 'key-moments-widget__visibility-label--off': widget.isHidden }"
            :for="visibilitySwitchId"
          >
            {{ t('keyMoments.visibility.switchLabel') }}
          </label>
          <PSwitch
            :pId="visibilitySwitchId"
            :modelValue="widget.isHidden === false"
            :pTestId="`key-moments-${widget.id}-visibility-switch`"
            @update:model-value="emit('toggle-visibility')"
          />
        </div>
      </slot>
    </header>

    <div class="key-moments-widget__body">
      <Chart
        v-if="widget.renderer === Renderer.CHART && widget.chart !== undefined"
        :widgetId="widget.id"
        :chart="widget.chart"
      />
      <Waterfall
        v-else-if="widget.renderer === Renderer.WATERFALL && widget.waterfall !== undefined"
        :widgetId="widget.id"
        :waterfall="widget.waterfall"
      />
      <BalanceImage
        v-else-if="widget.renderer === Renderer.BALANCE_IMAGE
          && widget.balanceImage !== undefined"
        :widgetId="widget.id"
        :balanceImage="widget.balanceImage"
      />
      <BalanceSheet
        v-else-if="widget.renderer === Renderer.BALANCE_SHEET
          && widget.balanceSheet !== undefined"
        :widgetId="widget.id"
        :balanceSheet="widget.balanceSheet"
      />
      <Narrative
        v-else-if="widget.renderer === Renderer.NARRATIVE && widget.narrative !== undefined"
        :widgetId="widget.id"
        :narrative="widget.narrative"
      />
      <Table
        v-else-if="widget.renderer === Renderer.TABLE && widget.table !== undefined"
        :widgetId="widget.id"
        :columns="widget.table.columns"
        :rows="widget.table.rows"
      />
      <Cards
        v-else-if="widget.cards !== undefined"
        :cards="widget.cards"
      />
    </div>

    <!-- A band at the foot of the panel, the width of it: the comments read after the figures -->
    <footer
      v-if="isReadOnly === false && widget.isCommentHidden === false && board !== undefined"
      class="key-moments-widget__footer"
    >
      <Comment
        :widgetId="widget.id"
        :variants="board.variants"
        :retainedKey="board.retainedKey"
        :publishableKey="board.publishableKey"
        :isDiscarded="board.isDiscarded"
        :draftVariant="board.draftVariant"
        @save="onSave"
        @retain="onRetain"
        @discard="onDiscard"
        @delete="onDelete"
      />
    </footer>
    <footer
      v-else-if="isReadOnly && widget.isCommentHidden === false && hasComment"
      class="key-moments-widget__footer"
    >
      <CommentBox
        class="key-moments-widget__comment-box"
        :testIdPrefix="`key-moments-${widget.id}-comment`"
        :text="widget.comment"
      />
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { PSwitch } from '@pulse/styleguide/components'
import { Renderer } from '../../enums/key-moments.enums'
import BalanceImage from '../balance-image/balance-image.vue'
import BalanceSheet from '../balance-sheet/balance-sheet.vue'
import Cards from '../cards/cards.vue'
import Comment from '../comment/comment.vue'
import CommentBox from '../comment/comment-box.vue'
import Narrative from '../narrative/narrative.vue'
import Table from '../table/table.vue'
import type {
  CommentBoard,
  CommentVariant,
  SaveSettlement,
  Widget,
} from '../../types/key-moments.types'

// Loaded on demand so that chart.js only weighs on the pages showing a chart
const Chart = defineAsyncComponent(() => import('../chart/chart.vue'))
const Waterfall = defineAsyncComponent(
  () => import('../waterfall/waterfall.vue'),
)

const props = withDefaults(defineProps<{
  widget: Widget
  board?: CommentBoard
  /** Client surface: the retained text only, no arbitration */
  isReadOnly?: boolean
  /** Marks a hidden widget in its title, for the surfaces that show no visibility switch */
  hasHiddenBadge?: boolean
}>(), {
  board: undefined,
  isReadOnly: false,
  hasHiddenBadge: false,
})

const emit = defineEmits<{
  'toggle-visibility': []
  'save-comment': [slotId: string, text: string, settle: SaveSettlement]
  'retain-comment': [slotId: string, variant: CommentVariant]
  'discard-comment': [slotId: string]
  'delete-comment': [slotId: string, text: string, isDisplayed: boolean]
}>()

const { t } = useI18n()

const hasComment = computed(() => isNotNullNorEmpty(props.widget.comment))

// The label names the switch, so that clicking the words toggles it too
const visibilitySwitchId = computed(() => `key-moments-${props.widget.id}-visibility`)

function onSave(text: string, settle: SaveSettlement) {
  if (props.board === undefined) {
    settle(false)

    return
  }

  emit('save-comment', props.board.slotId, text, settle)
}

function onRetain(variant: CommentVariant) {
  if (props.board === undefined) {
    return
  }

  emit('retain-comment', props.board.slotId, variant)
}

function onDelete(text: string, isDisplayed: boolean) {
  if (props.board === undefined) {
    return
  }

  emit('delete-comment', props.board.slotId, text, isDisplayed)
}

function onDiscard() {
  if (props.board === undefined) {
    return
  }

  emit('discard-comment', props.board.slotId)
}
</script>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;
@use '../../styles/screen';

.key-moments-widget {
  @include screen.block-surface;

  // Off-screen blocks skip layout and resize observations while the navigation folds
  content-visibility: auto;
  contain-intrinsic-size: auto 420px;

  // The entrance animation fills forwards, so the opacity must be the value it ends on
  &--hidden {
    --key-moments-enter-opacity: 0.4;

    opacity: var(--key-moments-enter-opacity);
  }

  &__head {
    padding: 16px 24px;
    border-bottom: 1px solid var(--key-moments-line);
  }

  &__title {
    font-size: 15.5px;
    letter-spacing: -0.005em;
  }

  &__badge {
    @include screen.badge;

    vertical-align: middle;
    border: 1px solid var(--key-moments-line);
  }

  &__visibility-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--p-jungle-500);
    cursor: pointer;

    &--off {
      color: var(--p-text-neutral);
    }
  }

  // Takes the free height of the row so that the band sits at the foot
  &__body {
    flex: 1;
    padding: 20px 24px 24px;
  }

  &__footer {
    padding: 18px 24px 20px;
    background-color: var(--p-humming-bird-100);
    border-top: 1px solid var(--key-moments-line);
  }

  // The band already pads and tints the encart it carries
  &__footer &__comment-box {
    padding: 0;
    background-color: transparent;
  }

  // On a phone, the margin of the block is width the figures inside it need
  @include breakpoints.media(xs) {
    &__head,
    &__body,
    &__footer {
      padding-right: 16px;
      padding-left: 16px;
    }

    &__head {
      flex-wrap: wrap;
      row-gap: 8px;
    }
  }
}
</style>
