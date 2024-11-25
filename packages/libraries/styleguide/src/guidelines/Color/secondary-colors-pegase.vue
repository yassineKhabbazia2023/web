<template>
  <PRow :pGutter="12">
    <PCol
      :pSpan="24"
      :pXs="{ span: 24 }"
    >
      <div class="demo-color-box demo-color-box--pegase">
        <div class="bg-color-sub">
          <div
            v-for="(type, i) in colorsType"
            :key="i"
            class="bg-secondary-sub-item transition cursor-pointer hover:shadow"
            :style="{
              width: `${100 / 3}%`,
              background: `var(--el-color-${type})`,
            }"
            @click="copyColor(`${type}`)">
            {{ getColorValue(type).toUpperCase() }}
          </div>
        </div>
      </div>
    </PCol>
  </PRow>
</template>

<script lang="ts" setup>
import { getColorValue, useCopyColor } from '../../utils'
import PCol from '../../atoms/PCol'
import PRow from '../../atoms/PRow'

const colorsType = [
  'secondary-fuschia',
  'secondary-fuschia-txt',
  'secondary-fuschia-bg',
  'secondary-amethyste',
  'secondary-amethyste-txt',
  'secondary-amethyste-bg',
  'secondary-cyan',
  'secondary-cyan-txt',
  'secondary-cyan-bg',
]

const { copyColor } = useCopyColor()
</script>
