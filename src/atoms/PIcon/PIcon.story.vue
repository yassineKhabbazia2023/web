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

<template>
  <Story title="Atoms/PIcon" icon="radix-icons:margin">
    <Variant
    :title="item.name"
    v-for="(item, index) in iconsData"
    :key="index">
      <PIcon color="#5546FF" size="20px">
        <component :is="item.component" />
      </PIcon>
    </Variant>
  </Story>
</template>

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
</docs>
