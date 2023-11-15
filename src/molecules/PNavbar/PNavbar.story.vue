<template>
  <Story
    title="3. Molecules/Navbar"
    icon="gala:menu-left"
    :layout="{
      type: 'single',
      iframe: false,
    }">
    <div class="container">
      <Variant
        title="Basic Usage"
        :source="navbarSource"
      >
        <PNavbar
          class="aside"
          :pEntities="basicNavData.entities"
          :pHandleClickEntity="handleClickEntity"
          :pMenuList="basicNavData.menus"
        >
          <template #title >
            Entities
          </template>
        </PNavbar>
        <router-view />
        <template #controls>
          <HstJson
            v-model="basicNavData.entities"
            title="pEntities"
          />
          <HstJson
            v-model="basicNavData.menus"
            title="pMenus"
          />
        </template>
      </Variant>
    </div>
  </Story>
</template>

<script lang="ts" setup>
import { reactive, computed, ref } from 'vue'
import { logEvent } from 'histoire/client'
import type { PAvatarProps } from '@/atoms/PAvatar/PAvatarTypes'
import PNavbar from './'

const entities = [
  { pName: 'Restaurant Johnny s pizza', pIdAccount: 'idAccount', pIcon: 'PICupHot', pColor: ref<PAvatarProps['pColor']>('orange') },
  { pName: 'Jean Levage', pIdAccount: 'idAccount 2', pIcon: 'PIShop', pColor: ref<PAvatarProps['pColor']>('green') }
]

const menus = [
  { pName: 'My entities', pIcon: 'PIGrid', pPath: '/entity' }
]
const basicNavData = reactive({
  entities,
  menus
})

const navbarSource = computed(() => {
  return '<PNavbar class="aside" :pEntities="entities" :pMenuList="menus"/>'
})

const handleClickEntity = (idAccount: string) => {
  logEvent('handleClickEntity', idAccount)
}
</script>

<docs lang="md">
  ## Navbar Attributes

  | Name       | Description                                  | Type                               | Default                |
  | ---------- | -------------------------------------------- | ---------------------------------- | ---------------------- |
  | `pEntities` | Entity list for the second part of the menu  | `Object as PropType<EntityProps[]>`| inherit from entities  |
  | `pMenuList` | Menu list for the first part of the menu     | `Object as PropType<MenuProps[]>`  | inherit from menulist  |

  ## Navbar Slots

  | Name      | Description                |
  | --------- | -------------------------- |
  | `title`   | Customize components title |

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D443%253A811%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
