<template>
  <ul>
    <li
      v-for="colorGroup in colorGroups"
      :key="colorGroup.groupKey"
    >
      <ul>
        <li
          v-for="({ className, colorKey, color }) in colorGroup.colors"
          :key="`${colorGroup.groupKey}-${colorKey}`"
          class="padding--3 cursor-pointer flex"
          :class="className"
          @click="onClickColor(className)"
        >
          <span class="font-bold flex--grow-1">{{ className }}</span>
          <span class="margin-left--1">{{ color }}</span>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { colorsConfig } from './colorsConfig'
import type { Prefix, Color, ColorGroup } from './ColorsDictionaryTypes'
import { useClipboard } from '@vueuse/core'

const props = defineProps<{
  prefix: Prefix
  groupKey: string
}>()

const colorGroups = computed(() => {
  return Object.keys(colorsConfig)
    .filter(groupKey => !props.groupKey || groupKey === props.groupKey)
    .map<ColorGroup>((groupKey) => {
      const colorKeys = Object.keys(colorsConfig[groupKey])

      const colors = colorKeys
        .map<Color>(colorKey => ({
          colorKey,
          className: `${props.prefix}--${groupKey}-${colorKey}`,
          color: colorsConfig[groupKey][colorKey] as unknown as string,
        }))

      return {
        groupKey,
        colors,
      }
    })
})

function onClickColor(source: string) {
  const { copy, isSupported } = useClipboard({ source })

  copy(source)
  if (isSupported) {
    ElMessage.success(`Copied ${source}`)
  }
}
</script>
