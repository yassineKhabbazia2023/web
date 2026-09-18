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
    <span
      v-if="widget.isHidden"
      class="key-moments-widget__badge position--absolute"
      :data-testid="`key-moments-${widget.id}-hidden-badge`"
    >
      {{ t('keyMoments.visibility.hiddenBadge') }}
    </span>

    <header
      class="
        flex
        flex--align-items-center
        flex--justify-content-space-between
        flex-gap--4
        margin-bottom--4
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
      </h3>

      <!-- The editor hangs its own tools here, in place of the eye -->
      <slot name="toolbar">
        <PTooltip
          v-if="isReadOnly === false"
          :pContent="widget.isHidden
            ? t('keyMoments.visibility.show')
            : t('keyMoments.visibility.hide')"
          pPlacement="left"
        >
          <PButton
            pSize="small"
            pIconOnly
            :pTestId="`key-moments-${widget.id}-visibility-button`"
            @click="emit('toggle-visibility')"
          >
            <PIcon :pName="widget.isHidden ? 'eyeSlash' : 'eye'" />
          </PButton>
        </PTooltip>
      </slot>
    </header>

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

    <!-- Takes the free height of the row so that the encart sits at the foot -->
    <div class="key-moments-widget__filler" />

    <Comment
      v-if="isReadOnly === false && widget.isCommentHidden === false && board !== undefined"
      class="key-moments-widget__comment"
      :widgetId="widget.id"
      :variants="board.variants"
      :retainedKey="board.retainedKey"
      :publishableKey="board.publishableKey"
      :isDiscarded="board.isDiscarded"
      :draftVariant="board.draftVariant"
      @save="onSave"
      @retain="onRetain"
      @discard="onDiscard"
    />
    <CommentBox
      v-else-if="isReadOnly && widget.isCommentHidden === false && hasComment"
      class="key-moments-widget__comment"
      :testIdPrefix="`key-moments-${widget.id}-comment`"
      :text="widget.comment"
    />
  </article>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { PButton, PIcon, PTooltip } from '@pulse/styleguide/components'
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
}>(), {
  board: undefined,
  isReadOnly: false,
})

const emit = defineEmits<{
  'toggle-visibility': []
  'save-comment': [slotId: string, text: string, settle: SaveSettlement]
  'retain-comment': [slotId: string, variant: CommentVariant]
  'discard-comment': [slotId: string]
}>()

const { t } = useI18n()

const hasComment = computed(() => isNotNullNorEmpty(props.widget.comment))

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

function onDiscard() {
  if (props.board === undefined) {
    return
  }

  emit('discard-comment', props.board.slotId)
}
</script>

<style scoped lang="scss">
@use '../../styles/screen';

.key-moments-widget {
  @include screen.block;

  // Off-screen blocks skip layout and resize observations while the navigation folds
  content-visibility: auto;
  contain-intrinsic-size: auto 420px;

  // The entrance animation fills forwards, so the opacity must be the value it ends on
  &--hidden {
    --key-moments-enter-opacity: 0.4;

    opacity: var(--key-moments-enter-opacity);
  }

  &__comment {
    margin-top: 18px;
  }

  &__badge {
    @include screen.badge;

    top: 8px;
    right: 8px;
    z-index: 11;
    padding: 2px 8px;
    border: 1px solid var(--key-moments-line);
  }

  &__filler {
    flex: 1;
  }

  &__title {
    font-size: 15.5px;
    letter-spacing: -0.005em;
  }
}
</style>
