<template>
  <Story
    title="5. Utils/Notification"
    icon="mdi:push-notification"
    :layout="{ type: 'grid', width: 400}"
  >
    <Variant title="Notification">
      <div @click="toggleNotification">
        click here
      </div>
      <template #controls>
        <HstText v-model="title" title="title" />
        <HstText v-model="message" title="message" />
        <HstCheckbox v-model="showClose" title="showClose" />
        <HstInputNumber v-model="duration" title="duration" />
        <HstRadio
          v-model="position"
          title="position"
          :options="positions"
        />
      </template>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { PNotification } from './PNotification'
import { PNotificationProps } from './PNotificationTypes'

const title = ref<PNotificationProps['title']>('Title')
const message = ref<PNotificationProps['title']>('Message')
const showClose = ref<PNotificationProps['showClose']>(true)
const iconName = ref<PNotificationProps['iconName']>('check')
const duration = ref<PNotificationProps['duration']>()
const position = ref<PNotificationProps['position']>('bottom-right')
const positions = [
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
]

function toggleNotification() {
  PNotification({
    title: title.value,
    message: message.value,
    showClose: showClose.value,
    iconName: iconName.value,
    position: position.value,
    duration: duration.value,
  })
}
</script>
