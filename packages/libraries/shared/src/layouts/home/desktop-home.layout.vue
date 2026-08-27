<template>
  <div
    class="common-layout"
    data-testid="common-layout"
  >
    <UserProfile
      v-if="hasUserProfileDrawerOpened"
      v-model:is-drawer-opened="hasUserProfileDrawerOpened"
      data-testid="home-user-profile"
    />

    <PContainer pDirection="vertical">
      <PCHeader
        class="header-container"
        height="56"
      >
        <DesktopHeader
          @show-user-profile-drawer="handleClick"
        >
          <template #header-top-right-zone>
            <slot name="header-actions" />
          </template>
        </DesktopHeader>
      </PCHeader>
      <PContainer class="aside-main-container">
        <PAside class="aside-container">
          <div class="sidebar-container flex position--relative">
            <Sidebar
              :current-entity="currentEntity"
              :favorite-entities="favoriteEntities"
              :user-config="userConfig"
            />
            <SidebarEntity v-if="isEntityView" />
          </div>
        </PAside>
        <PContainer
          class="main-container"
          :class="{
            'main-container--no-paddings': shouldRemovePadding,
            'bg--gray-50': shouldUseGrayBackground,
          }"
        >
          <slot
            name="banner"
            :banner-class="shouldRemovePadding ? 'margin--4 width--auto' : undefined"
          />
          <ContentLoader v-show="isContentLoading === true" />
          <router-view v-show="isContentLoading === false" />
        </PContainer>
      </PContainer>
    </PContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { PCHeader, PAside, PContainer } from '@pulse/styleguide/components'
import { ContentLoader } from '@pulse/shared/components'
import { useCurrentEntityRouting } from '@pulse/shared/composables'
import { useLoadingStore } from '@pulse/common/stores'
import UserProfile from './user-profile'
import { LAYOUT_GRAY_BACKGROUND_META, LAYOUT_NO_PADDING_META } from '@pulse/common/constants'
import { DesktopHeader } from './header'
import { Sidebar, SidebarEntity } from './navigation'
import type { HomeLayoutProps } from './home.layout.types'

const router = useRouter()
const { isContentLoading } = storeToRefs(useLoadingStore())
const { isEntityView } = useCurrentEntityRouting()

const hasUserProfileDrawerOpened = ref(false)

defineProps<HomeLayoutProps>()

const handleClick = () => {
  hasUserProfileDrawerOpened.value = true
}

const shouldRemovePadding = computed(() => {
  const removePadding = router.currentRoute.value?.meta[LAYOUT_NO_PADDING_META] === true
  return removePadding
})

const shouldUseGrayBackground = computed(() => {
  const useGrayBackground = router.currentRoute.value?.meta[LAYOUT_GRAY_BACKGROUND_META] === true
  return useGrayBackground
})

</script>

<style lang="scss" scoped>
.common-layout {
  .aside-main-container {
    display: flex;
  }

  .aside-container {
    width: inherit;
    overflow: visible;
  }

  .header-container {
    padding: 0;
  }

  .aside-container .sidebar-container {
    height: 100vh;
    z-index: 10;
  }

  .main-container {
    display: block;
    padding: 24px;
    position: relative;
    width: 100%;
    height: calc(100vh - var(--p-header-height));
    margin-top: var(--p-header-height);
    overflow: auto;

    &--no-paddings {
      padding: 0;
    }
  }
}
</style>
