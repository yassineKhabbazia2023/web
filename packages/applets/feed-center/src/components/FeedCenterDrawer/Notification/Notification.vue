<template>
  <div class="notification padding-bottom--1">
    <PNotificationCard
      :pIsNew="!isRead"
      :pTime="elapsedTime"
    >
      <template #avatar>
        <PAvatar
          pShape="circle"
          pType="default"
          pColor="white"
          :pSelected="false"
        >
          <div class="padding--2">
            <PImage pName="brand-monogram" />
          </div>
        </PAvatar>
      </template>

      <template #text>
        <div class="notification__title font-xsmall text-color--jungle-700">
          {{ notificationTitle }}
        </div>
        <p class="margin-top--1 text-color--black-rock-900">
          {{ message }}
        </p>
      </template>
    </PNotificationCard>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PNotificationCard, PAvatar, PImage } from '@pulse/styleguide/components'
import type { NotificationProps } from './notification.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      additionalEntitiesNames: 'and {count} other | and {count} others',
    },
    'fr-FR': {
      additionalEntitiesNames: 'et {count} autre | et {count} autres',
    },
  },
})

const props = defineProps<NotificationProps>()

const notificationTitle = computed(() => {
  const names = props.accountsNames
  const namesCount = names.length

  if (namesCount === 2) {
    return `${names[0]}, ${names[1]}`
  } else if (namesCount > 2) {
    const additionalNamesCount = namesCount - 2
    return `${names[0]}, ${names[1]} ${t('additionalEntitiesNames', { count: additionalNamesCount })}`
  } else {
    return names.join(', ')
  }
})
</script>

