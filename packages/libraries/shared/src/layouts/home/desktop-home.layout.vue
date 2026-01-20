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
          <Sidebar
            class="sidebar-container"
            :current-entity="currentEntity"
            :favorite-entities="favoriteEntities"
            :user-config="userConfig"
          />
        </PAside>
        <PContainer
          class="main-container"
          :class="{
            'main-container--no-paddings': shouldRemovePadding,
          }"
        >
          <router-view />
        </PContainer>
      </PContainer>
    </PContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PCHeader, PAside, PContainer } from '@pulse/styleguide/components'
import UserProfile from './user-profile'
import { LAYOUT_NO_PADDING_META } from '@pulse/common/constants'
import { DesktopHeader } from './header'
import { Sidebar } from './navigation'
import type { HomeLayoutProps } from './home.layout.types'

const router = useRouter()

const hasUserProfileDrawerOpened = ref(false)

defineProps<HomeLayoutProps>()

const handleClick = () => {
  hasUserProfileDrawerOpened.value = true
}

const shouldRemovePadding = computed(() => {
  const removePadding = router.currentRoute.value?.meta[LAYOUT_NO_PADDING_META] === true
  return removePadding
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
    padding-right: 50px;
    position: relative;
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
