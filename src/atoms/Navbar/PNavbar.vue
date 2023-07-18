<template>
  <el-menu
    :backgroundColor="backgroundColor"
    hoverBackgroundColor="var(--el-color-secondary-cyan-bg)"
    :textColor="backgroundColor.includes('white') ? 'black' : 'white'"
    class="el-menu-vertical-demo hidden-sm-and-down"
    :collapse="isCollapse"
  >
    <el-menu-item
      class="title"
    >
      <span>Portefeuille</span>
      <el-icon
        @click="collapseMenu"
        class="icon-collapse"
      >
        <DArrowRight v-show="isCollapse" />
        <DArrowLeft v-show="!isCollapse" />
      </el-icon>
    </el-menu-item>
    <el-menu-item
      index="2"
      @click="handleClickPortefeuille"
    >
      <el-icon><icon-menu /></el-icon>
      <span>Voir mes dossiers</span>
    </el-menu-item>
    <div class="divider">
    <el-divider />
    </div>
    <el-menu-item
      v-for="(item, index) in entities"
      :key="item.idAccount"
      @click="handleClickEntity(item.idAccount)"
      :index="index + 2"
    >
      <el-icon>
        <document />
      </el-icon>
      <span class="font-bold">{{ item.name }}</span>
    </el-menu-item>
  </el-menu>
  <el-menu
    mode="horizontal"
    :backgroundColor="backgroundColor"
    activeTextColor="var(--el-color-white)"
    :textColor="backgroundColor.includes('white') ? 'black' : 'white'"
    class="el-menu-horizontal-demo hidden-md-and-up"
  >
    <el-menu-item
      v-for="(item, index) in entities"
      @click="handleClickEntity(item.idAccount)"
      :key="item.idAccount"
      :index="index"
    >
      <el-icon>
        <document />
      </el-icon>
      <span class="font-bold">{{ item.name }}</span>
    </el-menu-item>
    <el-menu-item
      class="icon-collapse"
      @click="handleClickPortefeuille"
    >
      <el-icon><icon-menu /></el-icon>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue'
import {
  Document,
  Menu as IconMenu,
  DArrowRight, DArrowLeft
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

interface EntityProps {
  idAccount: string
  name: string
}

const isCollapse = ref(true)
const router = useRouter()

defineProps({
  entities: Object as PropType<EntityProps[]>,
  backgroundColor: { type: String, default: 'var(--el-color-neutral-gray-700)' }
})

const collapseMenu = () => {
  isCollapse.value = !isCollapse.value
}

const handleClickEntity = (idAccount: string) => {
  console.log('current entity', idAccount)
}

const handleClickPortefeuille = () => {
  router.push('/entity')
}
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  .title span {
    margin-left: 4px;
    font-size: 16px;
  }

  .divider {
    width: 97%;
  }
}

.divider {
  margin: auto;
  width: 60%;
}

.el-menu-horizontal-demo .icon-collapse {
  padding: 20px;
}

span {
  font-size: 12px;
}

.icon-collapse {
  margin-left: auto;
}

.el-divider--horizontal {
  margin: 10px 0;
}

.is-active {
  background-color: var(--el-color-neutral-gray-900);
  color: var(--el-color-white);
}
</style>
