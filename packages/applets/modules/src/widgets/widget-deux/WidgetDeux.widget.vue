<template>
  <div class="widget-deux">
    <h4>Widget Test Two</h4>
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
.widget-deux {
  button {
    background-color: #FF0000; /* dark red */
    border: none;
    border-radius: 5px; /* Added border radius */
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    transition: background-color 0.3s; /* Added transition for hover effect */
  }

  button:hover {
    background-color: #C70000; /* dark red on hover */
  }
}
</style>
