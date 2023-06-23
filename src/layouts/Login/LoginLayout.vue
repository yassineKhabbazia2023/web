<script setup lang="ts">
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-main class="add-border">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.add-border {
  border: 1px dashed blueviolet;
}
</style>
