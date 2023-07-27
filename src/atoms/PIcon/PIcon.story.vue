<template>
  <Story
    title="2. Atoms/Icon"
    icon="radix-icons:margin"
    :layout="{
      type: 'single',
      iframe: false,
    }">
    <Variant>
      <ul class="demo-icon-list">
        <li
          class="icon-item"
          :title="item.name"
          v-for="(item, index) in iconsData"
          :key="index">
          <span class="demo-svg-icon">
            <PIcon color="#5546FF" size="20px">
              <component :is="item.component" />
            </PIcon>
            <span class="icon-name">{{ item.name }}</span>
          </span>
        </li>
      </ul>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, defineAsyncComponent } from 'vue'
import { pulseGeneratedIcons } from './components/constants'

const iconsData = ref([] as any[])
onBeforeMount(() => {
  iconsData.value = pulseGeneratedIcons.map((component) => {
    return {
      name: `${component}`,
      component: defineAsyncComponent(() => import(`./components/${component}.vue`))
    }
  })
})
</script>

<style scoped lang="scss">
.demo-icon-list {
  overflow: hidden;
  list-style: none;
  padding: 0!important;
  border-top: 1px solid var(--el-border-color);
  border-left: 1px solid var(--el-border-color);
  border-radius: 4px;
  display: grid;
  grid-template-columns: repeat(4,1fr);

    .icon-item {
    text-align: center;
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
