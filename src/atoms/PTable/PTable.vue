<template>
  <el-table :data="data" :stripe="stripe">
    <slot />
  </el-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElTable } from 'element-plus'

export default defineComponent({
  name: 'PTable',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    stripe: {
      type: Boolean,
      default: () => true
    }
  },
  component: {
    ElTable
  },
  setup() {
    return {}
  }
})
</script>
