<template>
  <div
    class="
      flex
      flex--direction-column
      flex-gap--3
    "
  >
    <label
      v-for="option in CARD_OPTIONS"
      :key="option"
      class="
        flex
        flex--align-items-center
        flex-gap--2
      "
    >
      <PSwitch
        :modelValue="cards[option] === true"
        :pLabel="t(`keyMoments.settings.widgetDrawer.cards.${option}`)"
        :pTestId="`key-moments-settings-widget-cards-${option}-switch`"
        @update:model-value="setCards({ [option]: cards[option] !== true })"
      />
      <span>{{ t(`keyMoments.settings.widgetDrawer.cards.${option}`) }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PSwitch } from '@pulse/styleguide/components'
import { useWidgetDrawer } from './widget-drawer.composable'
import type { RawCards } from './widget-drawer.types'

/** The three settings of the cards renderer, in the order the drawer reads them */
const CARD_OPTIONS: (keyof RawCards)[] = ['heroFirst', 'signColored', 'colored']

const { t } = useI18n()

const { cards, setCards } = useWidgetDrawer()
</script>
