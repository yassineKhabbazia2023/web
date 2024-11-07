<template>
  <PRow :pGutter="12">
    <PCol
      :pSpan="24"
      :pXs="{ span: 24 }"
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
    </PCol>
  </PRow>
</template>

<script lang="ts" setup>
import { getColorValue, useCopyColor } from '@styleguide/utils'
import PCol from '@styleguide/atoms/PCol'
import PRow from '@styleguide/atoms/PRow'

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
  'functionnal-teal-bg',
]

const { copyColor } = useCopyColor()
</script>
