<template>
  <el-tag
    v-bind="$props"
    :class="
      'el-tag--' + pColor
  ">
    <PIcon class="el-tag__icon--left" v-if="iconLeft">
      <component :is="iconLeft" />
    </PIcon>
    {{ content }}
    <PIcon class="el-tag__icon--right" v-if="iconRight">
      <component :is="iconRight" />
    </PIcon>
  </el-tag>
</template>

<script setup lang="ts">
import { ElTag } from 'element-plus'
import type { PTagProps } from './PTag'

defineProps<PTagProps>()
</script>
