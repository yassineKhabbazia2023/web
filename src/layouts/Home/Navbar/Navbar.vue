<script setup lang="ts">
const title = 'Navbar'
const menu = [
  {
    title: 'Go to Home',
    path: '/home'
  },
  {
    title: 'Go to Login',
    path: '/login'
  }
]
</script>

<template>
  <nav>
    <div>
      <h2>{{ title }}</h2>
    </div>
    <div v-for="item in menu" :key="item.path">
      <router-link :to="item.path">
        {{ item.title }}
      </router-link>
    </div>
  </nav>
</template>
