<template>
  <Story
    title="2. Atoms/Notification Card"
    icon="mdi:push-notification"
    :layout="{ type: 'grid', width: 400}"
  >
    <Variant title="Notification Card">
      <PNotificationCard
        :time="PNotificationCardData.time"
        :isNew="PNotificationCardData.isNew">
        <template #avatar>
          <PAvatar
          :shape="currentShape"
          :type="currentType"
          :color="currentColor"> AB </PAvatar>
        </template>
        <template #text>
          <span class="font-bold">Alexandre De Lavandia</span> filed you a document <span class="font-bold">liasse-fiscale.pdf</span> inside the folder Publications.
        </template>
        <template #actions>
          <PToolbox :elements="toolboxBasicData">
            <PButton
              type="generic"
              class="el-button--icon"
              size="small">
              <PIcon>
                <PIThreeDots />
              </PIcon>
            </PButton>
          </PToolbox>
        </template>
      </PNotificationCard>
      <template #controls>
        <HstCheckbox v-model="PNotificationCardData.isNew" title="New notif" />
      </template>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import PAvatar from '@/atoms/PAvatar'
import PToolbox from '@/molecules/PToolbox'
import PButton from '@/atoms/PButton'
import PIcon from '@/atoms/PIcon'
import PNotificationCard from './'
import { type PAvatarProps } from '@/atoms/PAvatar'

const currentShape = ref<PAvatarProps['shape']>('circle')
const currentType = ref<string | undefined>('default')
const currentColor = ref<PAvatarProps['color']>('persian-gradient')

const toolboxBasicData = ([
  {
    iconName: 'PICheck',
    value: 'Mark all read',
    actionName: 'readall'
  },
  {
    iconName: 'PITrash',
    value: 'Delete notification',
    actionName: 'delete'

  },
  {
    iconName: 'PIGear',
    value: 'Access to the notification\'s parameters',
    actionName: 'parameters'
  },
  {
    iconName: 'PIBellSlash',
    value: 'Disable this type of notifications',
    actionName: 'disable'
  }
])

const PNotificationCardData = reactive({
  isNew: false,
  time: '1sem'
})
</script>

<docs lang="md">
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D5313%253A828%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
