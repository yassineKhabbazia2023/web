<template>
  <Story
    title="3. Molecules/Header"
    :layout="{ type: 'single', iframe: false }"
  >
    <PHeader
      :ellipsis="false"
      :pHeaderMenu="menu"
      :defaultActive="routeActive"
      router
    >
      <template #logo>
        <router-link to="/" class="el-menu--header__link">
          <PImage
            class="el-menu--header__logo"
            pType="logos"
            pName="pulse-color"
            fit="fill"
          />
        </router-link>
      </template>
      <template #menu>
        <PHeaderTabs
          :pHeaderMenu="menu"
        />
      </template>
      <template #header-right>
        <PToolbox :elements="toolboxBasicData">
          <PAvatar
            pShape="circle"
            pType="small"
            pColor="persian-gradient"
          >
            AB
          </PAvatar>
        </PToolbox>
      </template>
    </PHeader>
    <router-view />
  </Story>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import PHeader from './'
import PAvatar from '@/atoms/PAvatar'
import PToolbox from '@/molecules/PToolbox'
import PHeaderTabs from '@/atoms/PHeaderTabs'
import PImage from '@/atoms/PImage'

const menu = [
  { pIcon: 'PIColumnsGap', pText: 'Dashboard', pPath: '/' },
  { pIcon: 'PIChatSquareText', pText: 'Lorem ipsum', pPath: '/loremipsum' },
  { pIcon: 'PIChatSquareText', pText: 'Lorem ipsum 2', pPath: '/loremipsum2' },
  { pIcon: 'PIChatSquareText', pText: 'Lorem ipsum 3', pPath: '/loremipsum3' },
  { pIcon: 'PIChatSquareText', pText: 'Lorem ipsum 4', pPath: '/loremipsum4' },
  { pIcon: 'PIChatSquareText', pText: 'Lorem ipsum 5', pPath: '/loremipsum5' },
  { pIcon: 'PIArchive', pText: 'Document', pPath: '/document' }
]
const toolboxBasicData = ref([
  {
    iconName: 'PIPerson',
    value: 'Profile',
    actionName: 'profile'
  },
  {
    iconName: 'PIPower',
    value: 'Logout',
    actionName: 'logout'

  }
])
const route = useRoute()

const routeActive = route.path
</script>

<docs lang="md">
PHeader use as the top bar menu. Below is a list of property needed

## Props

| Name          | Description                | Type                                                             | Required | Default |
| ------------- | -------------------------- | --------------------------------------------------------------   | -------- | ------- |
| pHeaderMenu   | Array of menu items object | [{pIcon: Icon's name, pText: Menu's title, pPath: Menu's link }] | Yes      | -       |
| defaultActive | Current active route       | string                                                           | Yes      | -       |

## Slot

### logo

Slot for the logo

```html
<template #logo>
  <el-image
    src="./src/assets/images/logos/iconpulse-color.svg"
    alt="logo"
    class="logo"
  />
</template>
```

### avatar

Slot for the avatar user

```html
<template #avatar>
  <el-avatar :size="26" :src="circleUrl" />
</template>
```
</docs>
<!-- eslint-enable max-len -->
