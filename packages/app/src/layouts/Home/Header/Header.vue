<template>
  <div
    class="header-section
      flex
      flex--align-items-center
      flex--justify-content-space-between
      padding-y--3
      padding-x--6
      shadow--4"
  >
    <router-link to="/">
      <PImage
        class="header-section__logo"
        pType="logos"
        pName="pulse-color"
        pFit="fill"
      />
    </router-link>
    <div class="flex">
      <PButton
        :pType="showCalendar ? 'white' : 'generic'"
        pSize="small"
        pIconOnly
        pPlain
        :pIsActive="showCalendar"
        :pRound="false"
        :pDisabled="false"
        :pLoading="false"
        @click="emit('update:showCalendar', !showCalendar)"
        data-testid="header-section-calendar-btn"
      >
        <PIcon>
          <PICalendarEvent v-if="!showCalendar" />
          <PIX v-if="showCalendar" />
        </PIcon>
      </PButton>
      <PDivider
        class="margin-x--4 header-section__divider"
        pDirection="vertical"
      />
      <div
        @click="emit('showUserProfileDrawer')"
        class="header-section__user-avatar cursor-pointer"
      >
        <PAvatar
          pShape="circle"
          pType="small"
          pColor="persian-gradient"
          data-ut="user-initials"
        >
          {{ userInitials }}
        </PAvatar>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { commonStore, getInitials } from '@pulse/Common'
import {
  PAvatar,
  PImage,
  PDivider,
  PButton,
  PIcon,
  PICalendarEvent,
  PIX,
} from '@kpmg/styleguide'
import type { HeaderProps } from './HeaderTypes'

defineProps<HeaderProps>()

const { user } = storeToRefs(commonStore())
const emit = defineEmits<{
  'update:showCalendar': [boolean]
  showUserProfileDrawer: []
}>()

const userInitials = computed(() =>
  getInitials(user.value?.firstName, user.value?.lastName),
)
</script>

<style lang="scss" scoped>
.header-section {
  z-index: 21;
  position: fixed;
  top: 0;
  left: 27px;
  border-bottom-left-radius: 24px;
  height: 56px;
  width: calc(100vw - 27px);
  background-color: var(--el-color-base-white);

  &__logo {
    width: 149px;
    height: 20px;
  }

  &__divider {
    height: 32px;
  }
}
</style>
