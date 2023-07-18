<template>
  <el-row :gutter="12">
    <el-col
      :span="24"
      :xs="{ span: 24 }"
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
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { getColorValue, useCopyColor } from '@/utils'

const colorsType = [
  'secondary-fushia',
  'secondary-fushia-txt',
  'secondary-fushia-bg',
  'secondary-amethyste',
  'secondary-amethyste-txt',
  'secondary-amethyste-bg',
  'secondary-cyan',
  'secondary-cyan-txt',
  'secondary-cyan-bg'
]

const { copyColor } = useCopyColor()
</script>
