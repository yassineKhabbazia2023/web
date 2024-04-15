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
    <PImage
      class="header-section__logo"
      pType="logos"
      pName="pulse-color"
      pFit="fill"
    />
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
          <PIArrowBarUp v-if="showCalendar" />
        </PIcon>
      </PButton>

      <PDivider class="margin-x--4 header-section__divider" pDirection="vertical" />

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
import { ref, computed, onMounted } from 'vue'
import {
  commonStore as useStore,
  dataProvider as useDataProvider,
} from '@kpmg/common'
import { PAvatar, PImage, PDivider, PButton, PIcon, PICalendarEvent, PIArrowBarUp } from '@kpmg/styleguide'
import type { HeaderProps } from './HeaderTypes'

defineProps<HeaderProps>()

const emit = defineEmits<{
  'update:showCalendar': [boolean]
  'showUserProfileDrawer': []
}>()

const store = useStore()

const { fetchUserData } = useDataProvider()
const firstName = ref(store.user?.firstName || '')
const lastName = ref(store.user?.lastName || '')

const userInitials = computed(() => {
  return firstName.value?.charAt(0) + lastName.value?.charAt(0)
})

onMounted(async () => {
  if (!store.user && store.isAuthenticated) {
    const user = await fetchUserData()
    store.$patch({
      user: {
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        isCollab: user?.isCollab,
        id: user?.id,
      },
    })
    firstName.value = user?.firstName
    lastName.value = user?.lastName
  }
})
</script>

<style lang="scss" scoped>
.header-section {
  z-index: 20;
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
