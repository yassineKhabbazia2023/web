<script setup lang="ts">
import Header from '@/layouts/Home/Header'
import Navbar from '@/layouts/Home/Navbar'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px" class="add-border">
        <Navbar />
      </el-aside>
      <el-container>
        <el-header class="add-border">
          <Header />
        </el-header>
        <el-main class="add-border">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.add-border {
  border: 1px dashed blueviolet;
}
</style>
