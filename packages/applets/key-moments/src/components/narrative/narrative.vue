<template>
  <div
    class="key-moments-narrative font-size--14"
    :data-testid="`key-moments-${widgetId}-narrative`"
  >
    <section
      v-if="narrative.head.length > 0"
      class="key-moments-narrative__block"
    >
      <h4
        class="
          key-moments-narrative__title
          padding-y--2
          padding-x--3
          font-size--11
          font-semibold
          text-uppercase
        "
      >
        {{ t('keyMoments.narrative.start') }}
      </h4>
      <ul class="list-style-none">
        <li
          v-for="line in narrative.head"
          :key="line.id"
          class="
            key-moments-narrative__line
            flex
            flex--align-items-baseline
            flex--justify-content-space-between
            flex-gap--4
            padding-y--2
            padding-x--3
          "
        >
          <span>{{ line.label }}</span>
          <span class="key-moments-narrative__value no-wrap">{{ line.value }}</span>
        </li>
      </ul>
    </section>

    <section
      v-for="block in narrative.blocks"
      :key="block.letter"
      class="key-moments-narrative__block"
    >
      <h4
        class="
          key-moments-narrative__title
          padding-y--2
          padding-x--3
          font-size--11
          font-semibold
          text-uppercase
        "
      >
        {{ block.total?.label }}
      </h4>

      <ul class="list-style-none">
        <li
          v-for="line in block.lines"
          :key="line.id"
          class="
            key-moments-narrative__line
            flex
            flex--align-items-baseline
            flex--justify-content-space-between
            flex-gap--4
            padding-y--2
            padding-x--3
          "
        >
          <span>{{ line.label }}</span>
          <span class="key-moments-narrative__value no-wrap">{{ line.value }}</span>
        </li>
        <li
          class="
            key-moments-narrative__line
            key-moments-narrative__line--strong
            flex
            flex--align-items-baseline
            flex--justify-content-space-between
            flex-gap--4
            padding-y--2
            padding-x--3
          "
        >
          <span>
            <span
              class="
                key-moments-narrative__letter
                margin-right--2
                font-size--11
                font-bold
              "
              aria-hidden="true"
            >
              {{ block.letter }}
            </span>
            {{ block.total?.label }}
          </span>
          <span class="key-moments-narrative__value no-wrap">{{ block.total?.value }}</span>
        </li>
      </ul>
    </section>

    <section
      v-if="narrative.footer.length > 0"
      class="key-moments-narrative__block"
    >
      <h4
        class="
          key-moments-narrative__title
          padding-y--2
          padding-x--3
          font-size--11
          font-semibold
          text-uppercase
        "
      >
        {{ t('keyMoments.narrative.end') }}
      </h4>
      <ul class="list-style-none">
        <li
          v-for="line in narrative.footer"
          :key="line.id"
          class="
            key-moments-narrative__line
            key-moments-narrative__line--strong
            flex
            flex--align-items-baseline
            flex--justify-content-space-between
            flex-gap--4
            padding-y--2
            padding-x--3
          "
        >
          <span>{{ line.label }}</span>
          <span class="key-moments-narrative__value no-wrap">{{ line.value }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { NarrativeView } from '../../types/key-moments.types'

defineProps<{
  widgetId: string
  narrative: NarrativeView
}>()

const { t } = useI18n()
</script>

<style scoped lang="scss">
.key-moments-narrative {
  &__block + &__block {
    margin-top: 24px;
  }

  &__title {
    background-color: var(--key-moments-emphasis-surface);
    letter-spacing: 0.08em;
  }

  &__letter {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex: none;
    background-color: var(--p-jungle-400);
    color: var(--p-text-white);
    vertical-align: middle;
  }

  &__line {
    border-bottom: 1px solid var(--key-moments-line);

    // The line closing a block reads as a subtotal
    &--strong {
      background-color: var(--key-moments-emphasis-surface);
      font-weight: 600;
    }
  }

  &__value {
    font-variant-numeric: tabular-nums;
  }
}
</style>
