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
          <h3>{{ t('title') }}</h3>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<i18n lang="yaml">
  en-US:
    title: 'This is the Home layout'
  fr-FR:
    title: 'Ceci est le layout Home'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Header from './Header'
import Navbar from './Navbar'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
</script>

<style scoped>
.add-border {
  border: 1px dashed blueviolet;
}
</style>
