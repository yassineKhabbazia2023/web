<template>
  <div class="widget-test">
    <h4>Widget Test One</h4>
    <button @click="increment">
      Increment: {{ count }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const increment = () => {
  count.value++
}
</script>

<style lang="scss" scoped>
.widget-test {
  button {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
  }
}
</style>
