<template>
  <div
    class="
      key-moments-cards
      grid
      grid-gap--4
    "
  >
    <article
      v-for="card in cards"
      :key="card.id"
      class="
        key-moments-cards__card
        flex
        flex--direction-column
        flex-gap--2
        min-width--0
      "
      :class="getCardClasses(card)"
      :style="{ borderTopColor: card.color }"
      :data-testid="`key-moments-${card.id}-card`"
    >
      <header>
        <span class="key-moments-cards__label text-uppercase">{{ card.title }}</span>
        <DefinitionHint
          v-if="card.description !== undefined"
          :definition="card.description"
          :testId="`key-moments-${card.id}-card-definition`"
        />
      </header>

      <p
        v-if="card.value !== undefined"
        class="
          key-moments-cards__value
          margin--0
          font-size--26
        "
        :class="{ 'key-moments-cards__value--signed': card.isSignColored }"
      >
        {{ card.value }}
      </p>

      <!-- One row per exercise of the comparison, stacked so the same figure lines up across dates -->
      <dl
        v-if="card.references !== undefined"
        class="
          key-moments-cards__references
          flex
          flex--direction-column
          flex-gap--1
          margin--0
        "
      >
        <div
          v-for="reference in card.references"
          :key="reference.label"
          class="
            flex
            flex--justify-content-space-between
            flex-gap--2
          "
        >
          <dt
            class="
              key-moments-cards__compartment-label
              margin--0
              text-uppercase
            "
          >
            {{ reference.label }}
          </dt>
          <dd
            class="
              key-moments-cards__compartment-value
              font-bold
              no-wrap
            "
          >
            {{ reference.text }}
          </dd>
        </div>
      </dl>

      <footer
        v-if="card.previous !== undefined || hasVariation(card)"
        class="
          key-moments-cards__footer
          flex
          flex--align-items-stretch
          flex-gap--2
          margin-top--auto
        "
      >
        <div v-if="card.previous !== undefined">
          <p
            class="
              key-moments-cards__compartment-label
              margin--0
              text-uppercase
            "
          >
            {{ card.previous.label }}
          </p>
          <p
            class="
              key-moments-cards__compartment-value
              font-bold
              no-wrap
            "
          >
            {{ card.previous.text }}
          </p>
        </div>
        <div
          v-if="hasVariation(card)"
          class="text-right margin-left--auto"
        >
          <p
            class="
              key-moments-cards__compartment-label
              margin--0
              text-uppercase
            "
          >
            {{ t('keyMoments.cards.variation') }}
          </p>
          <span class="key-moments-cards__chip no-wrap">{{ formatVariation(card) }}</span>
        </div>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { TREND_CARD_MODIFIER } from '../../const/key-moments.consts'
import { formatVariation, hasVariation } from '../../utils/variation.utils'
import DefinitionHint from '../definition-hint/definition-hint.vue'
import type { Card } from '../../types/key-moments.types'

defineProps<{
  cards: Card[]
}>()

const { t } = useI18n()

// Trend tints the top border unless the indicator's own colour already claims it
function getCardClasses(card: Card): string[] {
  return [
    TREND_CARD_MODIFIER[card.trend],
    ...(card.isHighlighted ? ['key-moments-cards__card--hero'] : []),
    ...(card.isHidden ? ['key-moments-cards__card--hidden'] : []),
  ]
}
</script>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;
@use '../../styles/screen';

.key-moments-cards {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));

  &__card {
    padding: 16px 18px;
    background-color: var(--key-moments-card-surface);
    border: 1px solid var(--key-moments-line);
    border-top: 3px solid var(--p-text-basic-heading);

    &--positive {
      border-top-color: var(--p-jungle-400);
    }

    &--negative {
      border-top-color: var(--p-text-basic-error);
    }

    // Dimmed rather than removed, so a hidden card stays visible to the collaborator
    &--hidden {
      opacity: 0.4;
    }
  }

  &__label {
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.09em;
    color: var(--p-gray-500);
  }

  &__value {
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.01em;
    font-variant-numeric: tabular-nums;
    color: var(--p-text-basic-heading);
  }

  // Trend colour applied directly since a signed value has no chip
  &__card--positive &__value--signed {
    color: var(--p-jungle-500);
  }

  &__card--negative &__value--signed {
    color: var(--p-text-basic-error);
  }

  &__references {
    padding-top: 9px;
    border-top: 1px solid var(--key-moments-line);
  }

  &__footer {
    padding-top: 9px;
    border-top: 1px solid var(--key-moments-line);
  }

  &__compartment-label {
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.09em;
    color: var(--p-gray-500);
  }

  &__compartment-value {
    margin: 1px 0 0;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    margin-top: 2px;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 11.5px;
    font-weight: 800;
    background-color: var(--p-persian-100);
    color: var(--p-gray-500);
  }

  &__card--positive &__chip {
    background-color: var(--p-humming-bird-100);
    color: var(--p-jungle-500);
  }

  &__card--negative &__chip {
    background-color: var(--p-red-100);
    color: var(--p-text-basic-error);
  }

  // Hero: the first card of a widget configured with `heroFirst`
  &__card--hero {
    grid-column: 1 / -1;
    position: relative;
    overflow: hidden;
    padding: 22px 26px;
    border: none;
    background: linear-gradient(
      135deg,
      var(--p-black-rock-900) 0%,
      var(--p-tranquil-800) 55%,
      var(--p-jungle-400) 100%
    );

    // Needs z-index too: `::after` paints after the content and would sit above it
    > * {
      position: relative;
      z-index: 1;
    }

    // The two skewed bars of the RYDGE signature
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: -30px;
      bottom: -30px;
      width: 16px;
      transform: screen.$oblique-skew;
    }

    &::before {
      right: 98px;
      background-color: rgba(var(--p-jungle-400-rgb), 0.5);
    }

    &::after {
      right: 64px;
      background-color: rgba(var(--p-mint-tulip-500-rgb), 0.35);
    }

    .key-moments-cards__label,
    .key-moments-cards__compartment-label {
      color: var(--p-mint-tulip-500);
    }

    // Read on the dark gradient, like the label it follows
    :deep(.key-moments-definition-hint) {
      color: var(--p-mint-tulip-500);
    }

    .key-moments-cards__value {
      font-size: 40px;
      color: var(--p-text-basic-white);
    }

    .key-moments-cards__compartment-value {
      color: var(--p-text-basic-white);
    }

    .key-moments-cards__footer {
      border-top-color: rgba(var(--p-white-rgb), 0.22);
    }

    // No chip override: a translucent white would wash out the figure on the gradient
  }

  dd {
    margin-inline-start: 0;
  }

  // Hero shrinks to an ordinary card on mobile: the obliques would otherwise cross its figure
  @include breakpoints.media(xs) {

    &__card--hero {
      padding: 16px 18px;

      &::before,
      &::after {
        content: none;
      }

      .key-moments-cards__value {
        font-size: 26px;
      }
    }

    // Wraps instead of clipping the variation beside the previous period
    &__footer {
      flex-wrap: wrap;
    }

  }
}
</style>
