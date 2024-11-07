<template>
  <Story
    title="2. Atoms/Notification Card"
    icon="mdi:push-notification"
    :layout="{ type: 'grid', width: 400}"
  >
    <Variant title="Notification Card">
      <PNotificationCard
        :pTime="PNotificationCardData.pTime"
        :pIsNew="PNotificationCardData.pIsNew">
        <template #avatar>
          <PAvatar
            :pShape="currentShape"
            :pType="currentType"
            :pColor="currentColor"> AB </PAvatar>
        </template>
        <template #text>
          <span class="font-bold">Alexandre De Lavandia</span> filed you a document <span class="font-bold">liasse-fiscale.pdf</span> inside the folder Publications.
        </template>
        <template #actions>
          <PToolbox :pElements="toolboxBasicData">
            <PButton
              pType="generic"
              class="el-button--icon"
              pSize="small">
              <PIcon pName="threeDots" />
            </PButton>
          </PToolbox>
        </template>
      </PNotificationCard>
      <template #controls>
        <HstCheckbox v-model="PNotificationCardData.pIsNew" title="New notif" />
      </template>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import PAvatar from '@styleguide/atoms/PAvatar'
import PToolbox from '@styleguide/molecules/PToolbox'
import PButton from '@styleguide/atoms/PButton'
import PIcon from '@styleguide/atoms/PIcon'
import PNotificationCard from './'
import type { PAvatarProps } from '@styleguide/atoms/PAvatar/PAvatarTypes'
import type { PToolboxItemProps } from '@styleguide/atoms/PToolboxItem/PToolboxItemTypes'

const currentShape = ref<PAvatarProps['pShape']>('circle')
const currentType = ref<PAvatarProps['pType']>('default')
const currentColor = ref<PAvatarProps['pColor']>('persian-gradient')

const toolboxBasicData: PToolboxItemProps[] = [
  {
    pIconName: 'PICheck',
    pValue: 'Mark all read',
    pActionName: 'readall',
    pState: 'default',
  },
  {
    pIconName: 'PITrash',
    pValue: 'Delete notification',
    pActionName: 'delete',
    pState: 'default',
  },
  {
    pIconName: 'PIGear',
    pValue: "Access to the notification's parameters",
    pActionName: 'parameters',
    pState: 'default',
  },
  {
    pIconName: 'PIBellSlash',
    pValue: 'Disable this type of notifications',
    pActionName: 'disable',
    pState: 'default',
  },
]

const PNotificationCardData = reactive({
  pIsNew: false,
  pTime: '1sem',
})
</script>

<docs lang="md">
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D5313%253A828%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
