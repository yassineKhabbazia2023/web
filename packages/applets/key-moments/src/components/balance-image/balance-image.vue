<template>
  <div
    class="key-moments-balance-image"
    :data-testid="`key-moments-${widgetId}-balance-image`"
  >
    <div
      class="
        key-moments-balance-image__columns
        grid
        grid-cols--2
      "
    >
      <section
        v-for="column in balanceImage.columns"
        :key="column.id"
        class="key-moments-balance-image__column"
        :data-testid="`key-moments-${widgetId}-${column.id}-column`"
      >
        <h4
          class="
            key-moments-balance-image__title
            font-size--12
            font-semibold
            text-uppercase
            text-center
          "
        >
          {{ column.title }}
        </h4>

        <div
          class="
            key-moments-balance-image__stack
            flex
            flex--direction-column
          "
        >
          <div
            v-for="brick in column.bricks"
            :key="brick.id"
            class="
              key-moments-balance-image__brick
              flex
              flex--align-items-center
              flex--justify-content-space-between
              flex-gap--2
              font-size--12
            "
            :class="{ 'key-moments-balance-image__brick--light': isLightColor(brick.color) }"
            :style="{ backgroundColor: brick.color, flexGrow: brick.heightPct }"
            :data-testid="`key-moments-${widgetId}-${brick.id}-brick`"
          >
            <span
              class="
                key-moments-balance-image__brick-label
                min-width--0
                text-overflow--ellipsis
                no-wrap
              "
            >{{ brick.label }}</span>
            <span class="font-bold no-wrap">{{ brick.text }}</span>
          </div>
        </div>

        <p
          class="
            key-moments-balance-image__total
            margin--0
            padding-top--2
            font-size--12
            font-semibold
            text-center
          "
        >
          {{ column.total }}
        </p>
      </section>
    </div>

    <Legend
      class="margin-top--4"
      :entries="balanceImage.legend"
    />
  </div>
</template>

<script setup lang="ts">
import Legend from '../legend/legend.vue'
import { isLightColor } from '../../utils/color.utils'
import type { BalanceImageView } from '../../types/key-moments.types'

defineProps<{
  widgetId: string
  balanceImage: BalanceImageView
}>()
</script>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

$stack-height: 420px;

.key-moments-balance-image {
  &__columns {
    gap: 26px;
  }

  &__title {
    margin-bottom: 8px;
    letter-spacing: 0.08em;
    color: var(--p-text-heading);
  }

  // Fixed height so both halves are comparable as surfaces
  &__stack {
    height: $stack-height;
  }

  &__brick {
    flex-basis: 0;
    // Minimum height so a near-zero term still shows its label
    min-height: 28px;
    padding: 6px 8px;
    border-bottom: 1px solid var(--p-text-white);
    color: var(--p-text-white);

    &--light {
      color: var(--p-text-heading);
    }
  }

  &__brick-label {
    overflow: hidden;
  }

  &__total {
    border-top: 2px solid var(--p-text-heading);
    color: var(--p-text-heading);
  }
}

// Stays side by side on mobile: stacked, the two halves can no longer be compared
@include breakpoints.media(xs) {
  .key-moments-balance-image {
    &__columns {
      gap: 8px;
    }

    &__title {
      margin-bottom: 4px;
      font-size: 10px;
      letter-spacing: 0.04em;
    }

    &__brick {
      padding: 4px 6px;
      font-size: 10px;
    }

    // Wraps instead of truncating: an ellipsis would cut the label to one meaningless word
    &__brick-label {
      overflow: visible;
      white-space: normal;
    }

    &__total {
      font-size: 10px;
    }
  }
}
</style>
