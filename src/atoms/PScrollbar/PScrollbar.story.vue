<template>
  <Story
    title="2. Atoms/Scrollbar"
    icon="tabler:tooltip"
    :layout="{ type: 'grid', width: '80%' }"
  >
    <Variant title="Basic Usage">
      <PScrollBar pMaxHeight="200px">
        <p
          v-for="item in 20"
          :key="item"
          class="scrollbar-demo-item flex flex--justify-content-center flex--align-items-center margin--2 radius--1"
        >
          {{ item }}
        </p>
      </PScrollBar>
    </Variant>
    <Variant title="Horizontal scroll">
      <PScrollBar>
        <div class="flex">
          <p
            v-for="item in 50"
            :key="item"
            class="scrollbar-demo-item2 flex flex--justify-content-center flex--align-items-center margin--2 radius--1"
          >
            {{ item }}
          </p>
        </div>
      </PScrollBar>
    </Variant>
    <Variant title="Max height">
      <PButton
        pSize="small"
        class="margin-x--2"
        @click="onAdd"
      >
        Add Item
      </PButton>
      <PButton
        pType="danger"
        pSize="small"
        @click="onDelete"
      >
        Delete Item
      </PButton>
      <PScrollbar pMaxHeight="400px">
        <p
          v-for="item in count"
          :key="item"
          class="scrollbar-demo-item flex flex--justify-content-center flex--align-items-center margin--2 radius--1"
        >
          {{ item }}
        </p>
      </PScrollbar>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import type PScrollbar from '.'
import { ref } from 'vue'
import PScrollBar from './'

const count = ref(3)

const onAdd = () => {
  count.value++
}
const onDelete = () => {
  if (count.value > 0) {
    count.value--
  }
}
</script>

<style scoped>
.scrollbar-demo-item {
  height: 50px;
  text-align: center;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
.scrollbar-demo-item2 {
  flex-shrink: 0;
  width: 100px;
  height: 50px;
  text-align: center;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}
</style>

