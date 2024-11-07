<template>
  <Story title="3. Molecules/BottomMenu" icon="icon-park-outline:bottom-bar">
    <Variant title="Basic Usage">
      <router-view />
      <br /><br />
      <PBottomMenu
        :defaultActive="routeActive"
        :pItems="menuItems"
        :pHideOnDesktop="false"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { menu } from '@styleguide/constants/routesSamples'
import PBottomMenu from './'
import type { PItem } from './PBottomMenuTypes'

const menuItems = menu.map((m): PItem => {
  return {
    pName: m.name,
    pPath: m.path,
    pIcon: m.meta.icon,
  }
})

const route = useRoute()
const routeActive = route.path
</script>

<docs lang="md">
# Context

The bottom menu only appears on small desktop (phone & tablet).
It should have almost the same content as the top/main menu.

# Attributes

| Name           | Description                                    | Type      | Accepted Values                                 | Default |
| -------------- | ---------------------------------------------- | --------- | ----------------------------------------------- | ------- |
| pHideOnDesktop | Hide this element on desktop (lg and up)       | `Boolean` | `true` or `false`                               | `true`  |
| pUseRouter     | Use vue router                                 | `Boolean` | `true` or `false`                               | `true`  |
| pItems         | Items of the menu                              | `Array`   | [{icon: string, text: string: path: string}...] | `[]`    |
|                | The path in the object refer to the route path |           |                                                 |         |
| defaultActive  | The default active item                        | `String`  | a route path                                    |         |

# Figma

<div class="responsive-figma-container">
  <iframe class="responsive-figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D423%253A1405%26mode%3Ddev" allowfullscreen></iframe>
</div>
</docs>
