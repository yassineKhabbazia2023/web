<template>
  <!-- Temporary HTML/CSS for demonstration purpose -->
  <!-- TO BE DELETED -->
  <div class="widget-sso">
    <button>
      {{ title }}
    </button>
  </div>
</template>

<script lang="ts" setup>
const title = 'Connexion Pennylane'
</script>

<style lang="scss" scoped>
.widget-sso {
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  button {
    background-color: black;
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
