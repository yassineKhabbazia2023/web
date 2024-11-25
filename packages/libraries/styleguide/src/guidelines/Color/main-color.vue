<template>
  <PRow :pGutter="12">
    <PCol :pSpan="10" :pXs="{ span: 12 }">
      <div
        class="demo-color-box"
        :style="{ background: primary }"
      >
        Brand Color
        <div
          class="value"
          text="xs"
          @click="copyColor(`primary`)"
        >
          {{ primary.toUpperCase() }}
        </div>
        <div class="bg-color-sub" :style="{ background: primary }">
          <div
            v-for="level in colorLevel"
            :key="level"
            class="bg-blue-sub-item cursor-pointer hover:shadow text-center"
            :style="{
              width: `${100 / 5}%`,
              background: `var(--el-color-persian-${level})`,
            }"
            @click="copyColor(`persian-${level}`)"
          >
            #{{ level }}
          </div>
        </div>
      </div>
    </PCol>
  </PRow>
</template>

<script lang="ts" setup>
import { useCssVar } from '@vueuse/core'
import { useCopyColor } from '../../utils'
import PCol from '../../atoms/PCol'
import PRow from '../../atoms/PRow'

const primary = useCssVar('--el-color-primary')
const colorLevel = [900, 800, 700, 600, 500, 400, 300, 200, 100, 50]

const { copyColor } = useCopyColor()
</script>
