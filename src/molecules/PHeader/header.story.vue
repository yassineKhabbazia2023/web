<template>
  <Story
    title="3. Molecules/Header"
    :layout="{ type: 'grid', width: '100%' }"
  >
    <PHeader
      :ellipsis="false"
      :menu="menu"
      :defaultActive="routeActive"
      router
    >
      <template #logo>
        <router-link to="/">
          <PImage
            class="logo"
            type="logos"
            name="iconpulse-color"
            fit="fill"
          />
        </router-link>
      </template>
      <template #menu>
        <PHeaderTabs
          :menu="menu"
        />
      </template>
      <template #header-right>
        <PToolbox :elements="toolboxBasicData">
          <PAvatar
            shape="circle"
            size="small"
            color="persian-gradient"
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
  { icon: 'PIColumnsGap', text: 'Dashboard', path: '/' },
  { icon: 'PIChatSquareText', text: 'Lorem ipsum', path: '/loremipsum' },
  { icon: 'PIChatSquareText', text: 'Lorem ipsum 2', path: '/loremipsum2' },
  { icon: 'PIChatSquareText', text: 'Lorem ipsum 3', path: '/loremipsum3' },
  { icon: 'PIChatSquareText', text: 'Lorem ipsum 4', path: '/loremipsum4' },
  { icon: 'PIChatSquareText', text: 'Lorem ipsum 5', path: '/loremipsum5' },
  { icon: 'PIArchive', text: 'Document', path: '/document' }
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

| Name          | Description                | Type                                                          | Required | Default |
| ------------- | -------------------------- | ------------------------------------------------------------- | -------- | ------- |
| menu          | Array of menu items object | [{icon: Icon's name, text: Menu's title, path: Menu's link }] | Yes      | -       |
| defaultActive | Current active route       | string                                                        | Yes      | -       |

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
