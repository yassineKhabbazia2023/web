<template>
  <ul
    v-if="internalReminders.length > 0"
    class="list-style-none"
    data-testid="deadline-reminders"
  >
    <li
      v-for="({ days, beforeOrAfter }, index) in internalReminders"
      :key="index"
      class="
        margin-top--3
        flex
        flex--align-items-center
        text-color--neutral-gray-900
      "
      data-testid="deadline-reminders-row"
    >
      <PIcon>
        <PIBell />
      </PIcon>
      <i18n-t
        keypath="notification"
        tag="span"
        class="margin-left--2"
      >
        <template #days>
          <span class="font-semibold">
            {{ days }}
          </span>
        </template>
        <template #beforeOrAfter>
          <span>
            {{ beforeOrAfter }}
          </span>
        </template>
      </i18n-t>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DeadlineRemindersProps } from './DeadlineRemindersTypes'
import {
  PIcon,
  PIBell,
} from '@kpmg/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<DeadlineRemindersProps>()

const internalReminders = computed(() => props.reminders
  .map((reminder) => {
    const count = Math.abs(reminder)
    const beforeOrAfter = reminder < 0 ? t('before') : t('after')

    return {
      days: t('days', { count }, count),
      beforeOrAfter,
    }
  }))
</script>

<i18n lang="yaml">
  en-US:
    before: 'before'
    after: 'after'
    notification: 'Notification {days} {beforeOrAfter} deadline date'
    days: '{count} day | {count} day | {count} days'
  fr-FR:
    before: 'avant'
    after: 'après'
    days: '{count} jour | {count} jour | {count} jours'
    notification: 'Notification {days} {beforeOrAfter} la date du rappel'
</i18n>
