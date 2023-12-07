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
          class="scrollbar-demo-item"
        >
          {{ item }}
        </p>
      </PScrollBar>
    </Variant>
    <Variant title="Horizontal scroll">
      <PScrollBar>
        <div class="scrollbar-flex-content">
          <p
            v-for="item in 50"
            :key="item"
            class="scrollbar-demo-item2"
          >
            {{ item }}
          </p>
        </div>
      </PScrollBar>
    </Variant>
    <Variant title="Max height">
      <PButton @click="add">
        Add Item
      </PButton>
      <PButton @click="onDelete">
        Delete Item
      </PButton>
      <PScrollbar pMaxHeight="400px">
        <p
          v-for="item in count"
          :key="item"
          class="scrollbar-demo-item"
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

const add = () => {
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
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.scrollbar-flex-content {
  display: flex;
}
.scrollbar-demo-item2 {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}
</style>

