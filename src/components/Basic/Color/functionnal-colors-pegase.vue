<template>
  <el-row :gutter="12">
    <el-col
      :span="24"
      :xs="{ span: 24 }"
    >
      <div class="demo-color-box demo-color-box--pegase">
        <div class="bg-color-sub bg-color-sub--functionnal">
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
  'functionnal-red',
  'functionnal-red-txt',
  'functionnal-red-bg',
  'functionnal-orange',
  'functionnal-orange-txt',
  'functionnal-orange-bg',
  'functionnal-yellow',
  'functionnal-yellow-txt',
  'functionnal-yellow-bg',
  'functionnal-green',
  'functionnal-green-txt',
  'functionnal-green-bg',
  'functionnal-teal',
  'functionnal-teal-txt',
  'functionnal-teal-bg'
]

const { copyColor } = useCopyColor()
</script>
