
<template>
  <Story
    title="Atoms/BottomMenu"
    icon="icon-park-outline:bottom-bar"
  >
    <router-view />
    <br><br>
    <PBottomMenu
      :defaultActive="routeActive"
      :items="ITEMS"
      :hideOnDesktop="false"
    />
  </Story>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import PBottomMenu from './'

const route = useRoute()
const routeActive = route.path
const ITEMS = [
  {
    icon: 'PIFiles',
    text: 'Dashboard',
    path: '/dashboard'
  },
  {
    icon: 'PIFiles',
    text: 'Document',
    path: '/document'
  }
]
</script>

<docs lang="md">
# Context
The bottom menu only appears on small desktop (phone & tablet).
It should have almost the same content as the top/main menu.

# Attributes

| Name                      | Description                                       | Type                         | Accepted Values                                    | Default           |
| ------------------------- | ------------------------------------------------- |------------------------------|----------------------------------------------------|-------------------|
| hideOnDesktop             | Hide this element on desktop (lg and up)          | `Boolean`                    | `true` or `false`                                  | `true`            |
| useRouter                 | Use vue router                                    | `Boolean`                    | `true` or `false`                                  | `true`            |
| items                     | Items of the menu                                 | `Array`                      | [{icon: string, text: string: path: string}...]    | `[]`              |
|                           | The path in the object refer to the route path    |                              |                                                    |                   |
| defaultActive             | The default active item                           | `String`                     | a route path                                       |                   |

# Figma
[Link](https://www.figma.com/file/LRcMfRHINntp4qUgf3JChQ/%F0%9F%93%82-COLLAB-V2-%2F-BAF-%2F-Sprint-00?type=design&node-id=4-1180&mode=design&t=g1x2nMpqtES3cG9f-0)
</docs>
