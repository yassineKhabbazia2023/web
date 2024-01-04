<template>
  <Story
    title="2. Atoms/Icon"
    icon="radix-icons:margin"
    :layout="{
      type: 'single',
      iframe: false,
    }">
    <Variant>
    <div
      v-for="(group, indexGroup) in iconsData"
      :key="indexGroup">
        <h1>{{  group.category }}</h1>
        <ul
          class="demo-icon-list"
        >
          <li
            class="icon-item"
            :title="item.name"
            v-for="(item, index) in group.icons"
            :key="index">
            <span class="demo-svg-icon" @click="copyClipboard(item)">
              <PIcon color="#5546FF" size="20px">
                <component :is="item.component" />
              </PIcon>
              <span class="icon-name">{{ item.name }}</span>
            </span>
          </li>
        </ul>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { onBeforeMount, defineAsyncComponent, shallowRef } from 'vue'
import { pulseGeneratedIcons } from './components/constants'
import { manageClick } from '@/utils/mouse'
import { useCopyClipboard } from '@/utils/clipboard'

const iconsData = shallowRef([] as any[])
onBeforeMount(() => {
  iconsData.value = pulseGeneratedIcons.map((component) => {
    return {
      name: `${component.name}`,
      category: component.category,
      component: defineAsyncComponent(() => import(`./components/${component.name}.vue`))
    }
  }).reduce((groups, item) => {
    let group = groups.find((g: any) => g.category === item.category)

    if (!group) {
      group = {
        category: item.category,
        icons: []
      }
      groups.push(group)
    }
    group.icons.push(item)
    return groups
  }, [] as any)
})

const copyClipboard = (icon: any) => {

  const onSingleClick = () => {
    useCopyClipboard(icon.name)
  }
  const onDoubleClick = () => {
    useCopyClipboard(`  <PIcon color="#5546FF" size="20px">
    <${icon.name} />
  </PIcon>`)
  }

  manageClick(onSingleClick, onDoubleClick)
}

</script>

<style scoped lang="scss">
.demo-icon-list {
  overflow: hidden;
  list-style: none;
  padding: 0!important;
  border-radius: 4px;
  display: grid;
  grid-template-columns: repeat(4,1fr);

    .icon-item {
    text-align: center;
    border: 1px solid var(--el-border-color);
    margin: 8px;
    color: var(--el-text-color-regular);
    height: 90px;
    font-size: 13px;
    border-right: 1px solid var(--el-border-color);
    border-bottom: 1px solid var(--el-border-color);
    transition: background-color var(--el-transition-duration);

    .demo-svg-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      cursor: pointer;
    }

     .icon-name {
        margin-top: 8px;
    }
  }
}
</style>

<docs lang="md">
## Icônes
<div class="container">
  Au clic sur une case d'icône, sera copié le nom de l'icône, à utiliser dans vos
  composants.
  Au double clic, sera copié la composition 'PIcon' et l'icône cliqué
</div>

## Icon Attributes

| Name    | Description                | Type                           | Default                |
| ------- | -------------------------- | ------------------------------ | ---------------------- |
| `color` | SVG tag's fill attribute   | `Pick<CSSProperties, 'color'>` | inherit from color     |
| `size`  | SVG icon size, size x size | `number \| string`             | inherit from font size |

## Icon Slots

| Name      | Description               |
| --------- | ------------------------- |
| `default` | customize default content |

<div class="responsive-figma-container">
  <iframe class="responsive-figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FCmAQkyvJgicN6PHwf61DBZ%2F%25F0%259F%25A6%2584-Guidelines%3Ftype%3Ddesign%26node-id%3D560%253A149%26mode%3Ddev" allowfullscreen></iframe>
</div>
</docs>
