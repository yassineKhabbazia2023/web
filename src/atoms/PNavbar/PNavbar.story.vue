<template>
  <Story title="Atoms/Navbar">
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
import PNavbar from './'
import themeOptions from '../../constants/themeOptions'

const entities = [
  { name: 'Restaurant Johnny s pizza', idAccount: 'idAccount', icon: 'PICupHot', color: 'orange' },
  { name: 'Jean Levage', idAccount: 'idAccount 2', icon: 'PIShop', color: 'green' }
]

const menus = [
  { name: 'My entities', icon: 'PIGrid', path: '/entity' },
  { name: 'See customer view', icon: 'PIPersonVideo3', path: '/customer' }
]
const basicNavData = reactive({
  themeOptions,
  entities,
  menus
})

const navbarSource = computed(() => {
  return '<PNavbar class="aside" :entities="entities" :menuList="menus"/>'
})

const handleClickEntity = (idAccount: string) => {
  console.log('current entity', idAccount)
}
</script>

<!-- eslint-disable max-len -->
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

  <iframe src="https://www.figma.com/file/hycpUsOrc1fFD7xcYY0ryN/%F0%9F%A6%84-Librairie-de-composants?type=design&node-id=443-811&mode=design&t=2jOd4krjDx7sZuz6-0"></iframe>

</docs>
<!-- eslint-enable max-len -->
