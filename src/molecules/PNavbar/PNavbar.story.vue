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
          :entities="basicNavData.entities"
          :handleClickEntity="handleClickEntity"
          :menuList="basicNavData.menus"
        >
          <template #title >
            Entities
          </template>
        </PNavbar>
        <router-view />
        <template #controls>
          <HstJson
            v-model="basicNavData.entities"
            title="Entities"
          />
          <HstJson
            v-model="basicNavData.menus"
            title="Menus"
          />
        </template>
      </Variant>
    </div>
  </Story>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'
import { logEvent } from 'histoire/client'
import PNavbar from './'

const entities = [
  { name: 'Restaurant Johnny s pizza', idAccount: 'idAccount', icon: 'PICupHot', color: 'orange' },
  { name: 'Jean Levage', idAccount: 'idAccount 2', icon: 'PIShop', color: 'green' }
]

const menus = [
  { name: 'My entities', icon: 'PIGrid', path: '/entity' }
]
const basicNavData = reactive({
  entities,
  menus
})

const navbarSource = computed(() => {
  return '<PNavbar class="aside" :entities="entities" :menuList="menus"/>'
})

const handleClickEntity = (idAccount: string) => {
  logEvent('handleClickEntity', idAccount)
}
</script>

<docs lang="md">
  ## Navbar Attributes

  | Name       | Description                                  | Type                               | Default                |
  | ---------- | -------------------------------------------- | ---------------------------------- | ---------------------- |
  | `entities` | Entity list for the second part of the menu  | `Object as PropType<EntityProps[]>`| inherit from entities  |
  | `menuList` | Menu list for the first part of the menu     | `Object as PropType<MenuProps[]>`  | inherit from menulist  |

  ## Navbar Slots

  | Name      | Description                |
  | --------- | -------------------------- |
  | `title`   | Customize components title |

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D443%253A811%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
