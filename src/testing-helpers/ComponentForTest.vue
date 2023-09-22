<template>
  <div>
    <span class="foo">
      {{ foo }}
    </span>
    <PBar class="bar">
      {{ bar }}
    </PBar>
  </div>
</template>
<script lang="ts" setup>
const foo = 'foo'
const bar = 'bar'
</script>
